// ========================
// Environment & Dependencies
// ========================
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// ========================
// MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

// ========================
// Mongoose Models
// ========================

// User Model
const userSchema = new mongoose.Schema({
  name:              { type: String, required: true },
  phone:             { type: String, required: true, unique: true },
  city:              { type: String },
  platforms:         [String],
  avgDailyEarnings:  { type: Number },
  planName:          { type: String, default: null },
  weeklyPremium:     { type: Number, default: null },
  createdAt:         { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Claim Model
const claimSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  triggerType:   { type: String },
  hoursLost:     { type: Number },
  payoutAmount:  { type: Number },
  status:        { type: String, default: "paid" },
  createdAt:     { type: Date, default: Date.now }
});

const Claim = mongoose.model("Claim", claimSchema);

// ========================
// Temporary in-memory storage (kept for admin login)
// ========================
let adminUsers = [
  { id: 0, name: "admin", role: "admin" }
];

// ========================
// Home Route
// ========================
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ========================
// REGISTER API — Worker Registration (MongoDB)
// ========================
app.post("/register", async (req, res) => {
  try {
    const { name, phone, city, platform, avgDailyEarnings } = req.body;
    const platforms = platform ? [platform] : [];

    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required"
      });
    }

    // Check for duplicate phone
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(409).json({
        message: "A worker with this phone number is already registered."
      });
    }

    const user = new User({ name, phone, city, platforms, avgDailyEarnings });
    await user.save();

    res.json({
      message: "User registered",
      user
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// LOGIN API — by phone (MongoDB)
// ========================
app.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });

    if (user) {
      res.json({
        message: "Login successful",
        user
      });
    } else {
      res.status(404).json({
        message: "User not found"
      });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// ADMIN LOGIN API — by name (in-memory, kept for admin-web)
// ========================
app.post("/admin-login", (req, res) => {
  const { name } = req.body;

  const user = adminUsers.find(u => u.name === name);

  if (user) {
    res.json({
      message: "Login successful",
      user
    });
  } else {
    res.status(404).json({
      message: "User not found"
    });
  }
});

// ========================
// WORKER LOGIN API — by phone (MongoDB)
// ========================
app.post("/worker-login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const worker = await User.findOne({ phone });

    if (worker) {
      res.json({
        message: "Login successful",
        worker
      });
    } else {
      res.status(404).json({
        message: "No account found with this number. Please register first."
      });
    }
  } catch (err) {
    console.error("Worker login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// SELECT PLAN API (MongoDB)
// ========================
app.post("/select-plan", async (req, res) => {
  try {
    const { userId, planName, weeklyPremium } = req.body;

    if (!userId || !planName || weeklyPremium === undefined) {
      return res.status(400).json({
        message: "userId, planName, and weeklyPremium are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.planName = planName;
    user.weeklyPremium = Number(weeklyPremium);
    await user.save();

    res.json({
      message: "Plan activated",
      user
    });
  } catch (err) {
    console.error("Select plan error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET ALL USERS (MongoDB)
// ========================
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET ALL WORKERS — for admin dashboard (MongoDB)
// ========================
app.get("/workers", async (req, res) => {
  try {
    const workers = await User.find();
    res.json(workers);
  } catch (err) {
    console.error("Get workers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// WEATHER TRIGGER CHECK — Open-Meteo API
// ========================
app.get("/trigger/check", async (req, res) => {
  try {
    const city = req.query.city || "Bengaluru";
    let lat = 12.97;
    let lon = 77.59;
    
    if (city.toLowerCase() === "delhi") {
      lat = 28.61;
      lon = 77.20;
    } else if (city.toLowerCase() === "mumbai") {
      lat = 19.07;
      lon = 72.87;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation,temperature_2m&timezone=Asia%2FKolkata`;
    const response = await axios.get(url);

    const precipitationData = response.data.hourly.precipitation || [];
    const temperatureData = response.data.hourly.temperature_2m || [];
    
    const highestPrecip = precipitationData.length > 0 ? Math.max(...precipitationData) : 0;
    const highestTemp = temperatureData.length > 0 ? Math.max(...temperatureData) : 0;

    if (highestPrecip > 30) {
      return res.json({
        triggered: true,
        type: "Heavy Rain",
        severity: highestPrecip,
        hoursLost: 3,
        message: `Heavy rainfall detected in ${city}`
      });
    }

    if (highestTemp > 43) {
      return res.json({
        triggered: true,
        type: "Extreme Heat",
        severity: highestTemp,
        hoursLost: 3,
        message: `Extreme heat detected in ${city}`
      });
    }

    res.json({
      triggered: false,
      message: "No disruption detected"
    });
  } catch (err) {
    console.error("Trigger check error:", err);
    res.status(500).json({ message: "Weather API error", error: err.message });
  }
});

// ========================
// AQI TRIGGER CHECK — OpenAQ API
// ========================
app.get("/trigger/aqi", async (req, res) => {
  try {
    const city = req.query.city || "Bengaluru";
    const url = `https://api.openaq.org/v2/latest?city=${city}&parameter=pm25&limit=1`;
    const response = await axios.get(url);

    let pm25Value = 0;
    if (response.data && response.data.results && response.data.results.length > 0) {
      const measurements = response.data.results[0].measurements;
      if (measurements && measurements.length > 0) {
        pm25Value = measurements[0].value;
      }
    }

    if (pm25Value > 150) {
      return res.json({
        triggered: true,
        type: "AQI Spike",
        severity: pm25Value,
        hoursLost: 3,
        message: `Severe air pollution detected in ${city}`
      });
    }

    res.json({
      triggered: false,
      message: "No disruption detected"
    });
  } catch (err) {
    console.error("AQI check error:", err);
    res.status(500).json({ message: "AQI API error", error: err.message });
  }
});

// ========================
// CALCULATE LOSS API
// ========================
app.post("/calculate-loss", async (req, res) => {
  try {
    const { userId, triggerType, hoursLost } = req.body;
    
    if (!userId || !triggerType || hoursLost === undefined) {
      return res.status(400).json({ message: "userId, triggerType, and hoursLost are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avgDailyEarnings = user.avgDailyEarnings || 0;
    const hourlyRate = avgDailyEarnings / 8;
    
    let baseLoss = hourlyRate * hoursLost;

    const multipliers = {
      "Heavy Rain": 1.0,
      "Extreme Heat": 0.8,
      "AQI Spike": 0.7,
      "Strike": 1.0,
      "Flood": 1.2
    };

    const multiplier = multipliers[triggerType] || 1.0;
    
    let estimatedLoss = baseLoss * multiplier;
    
    // Round to nearest 10
    estimatedLoss = Math.round(estimatedLoss / 10) * 10;
    
    // Cap at user's weeklyPremium * 10
    if (user.weeklyPremium) {
      estimatedLoss = Math.min(estimatedLoss, user.weeklyPremium * 10);
    }

    res.json({
      estimatedLoss,
      hourlyRate,
      hoursLost,
      triggerType,
      message: `Estimated income loss for ${hoursLost} hours`
    });
  } catch (err) {
    console.error("Calculate loss error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// POST CLAIM — Save a new claim (MongoDB)
// ========================
app.post("/claims", async (req, res) => {
  try {
    const { userId, triggerType, hoursLost, payoutAmount } = req.body;

    const claim = new Claim({ userId, triggerType, hoursLost, payoutAmount });
    await claim.save();

    res.json({
      message: "Claim saved",
      claim
    });
  } catch (err) {
    console.error("Save claim error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// POST /claims/auto — Zero-Touch Processing
// ========================
app.post("/claims/auto", async (req, res) => {
  try {
    const { userId, triggerType, severity } = req.body;
    
    if (!userId || !triggerType) {
      return res.status(400).json({ message: "userId and triggerType are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 1. Check if user has an active plan
    if (!user.planName) {
      return res.status(400).json({ message: "User has no active insurance plan" });
    }

    // 3. Duplicate Prevention (check triggers for today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const duplicateClaim = await Claim.findOne({
      userId: user._id,
      triggerType,
      createdAt: { $gte: today }
    });

    if (duplicateClaim) {
      // 4. If duplicate
      return res.status(400).json({ error: "Claim already processed today" });
    }

    // 2. Call the loss calculation logic internally
    const hoursLost = req.body.hoursLost || 3;
    const avgDailyEarnings = user.avgDailyEarnings || 0;
    const hourlyRate = avgDailyEarnings / 8;
    let baseLoss = hourlyRate * hoursLost;

    const multipliers = {
      "Heavy Rain": 1.0,
      "Extreme Heat": 0.8,
      "AQI Spike": 0.7,
      "Strike": 1.0,
      "Flood": 1.2
    };
    const multiplier = multipliers[triggerType] || 1.0;
    
    let estimatedLoss = baseLoss * multiplier;
    estimatedLoss = Math.round(estimatedLoss / 10) * 10;
    if (user.weeklyPremium) {
      estimatedLoss = Math.min(estimatedLoss, user.weeklyPremium * 10);
    }

    // 5. Create new Claim
    const claim = new Claim({
      userId: user._id,
      triggerType,
      hoursLost,
      payoutAmount: estimatedLoss,
      status: "paid"
    });
    await claim.save();

    // 6. Return full claim
    res.json({
      message: "Claim processed automatically",
      claim
    });
  } catch (err) {
    console.error("Auto claim error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET ALL CLAIMS — with user details populated (MongoDB)
// ========================
app.get("/claims", async (req, res) => {
  try {
    const claims = await Claim.find().populate("userId");
    res.json(claims);
  } catch (err) {
    console.error("Get claims error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET /admin/stats
// ========================
app.get("/admin/stats", async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments();
    const activePlans = await User.countDocuments({ planName: { $ne: null } });
    const totalClaims = await Claim.countDocuments();
    
    const claims = await Claim.find({}, 'payoutAmount');
    const totalPaidOut = claims.reduce((sum, c) => sum + (c.payoutAmount || 0), 0);

    res.json({
      totalWorkers,
      activePlans,
      totalClaims,
      totalPaidOut,
      avgPayoutTime: "4.2 mins"
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET /admin/claims
// ========================
app.get("/admin/claims", async (req, res) => {
  try {
    const claims = await Claim.find().populate("userId", "name phone city");
    res.json(claims);
  } catch (err) {
    console.error("Admin claims error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// GET /admin/workers
// ========================
app.get("/admin/workers", async (req, res) => {
  try {
    const workers = await User.aggregate([
      {
        $lookup: {
          from: "claims",
          localField: "_id",
          foreignField: "userId",
          as: "claimsData"
        }
      },
      {
        $addFields: {
          claimCount: { $size: "$claimsData" }
        }
      },
      {
        $project: {
          claimsData: 0
        }
      }
    ]);
    res.json(workers);
  } catch (err) {
    console.error("Admin workers error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ========================
// START SERVER
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});