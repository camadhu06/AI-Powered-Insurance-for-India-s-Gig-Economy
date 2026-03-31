const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory storage
let users = [
  { id: 0, name: "admin", role: "admin" }
];

// Home route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// REGISTER API — Worker Registration
app.post("/register", (req, res) => {
  const { name, phone, email, platform, city, avgWeeklyEarning } = req.body;

  // Validate required fields
  if (!name || !phone || !email || !platform || !city || avgWeeklyEarning === undefined) {
    return res.status(400).json({
      message: "All fields are required: name, phone, email, platform, city, avgWeeklyEarning"
    });
  }

  // Check for duplicate phone
  const existing = users.find(u => u.phone === phone);
  if (existing) {
    return res.status(409).json({
      message: "A worker with this phone number is already registered."
    });
  }

  const worker = {
    id: users.length + 1,
    name,
    phone,
    email,
    platform,
    city,
    avgWeeklyEarning: Number(avgWeeklyEarning),
    role: "worker",
    registeredAt: new Date().toISOString()
  };

  users.push(worker);

  res.json({
    message: "Worker registered successfully",
    worker
  });
});

// GET ALL WORKERS (for admin dashboard)
app.get("/workers", (req, res) => {
  const workers = users.filter(u => u.role === "worker");
  res.json(workers);
});

// LOGIN API
app.post("/login", (req, res) => {
  const { name } = req.body;

  const user = users.find(u => u.name === name);

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

// WORKER LOGIN API (by phone)
app.post("/worker-login", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  const worker = users.find(u => u.phone === phone && u.role === "worker");

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
});

// SELECT PLAN API
app.post("/select-plan", (req, res) => {
  const { workerId, planName, weeklyPremium } = req.body;

  if (!workerId || !planName || weeklyPremium === undefined) {
    return res.status(400).json({
      message: "workerId, planName, and weeklyPremium are required"
    });
  }

  const worker = users.find(u => u.id === workerId);
  if (!worker) {
    return res.status(404).json({
      message: "Worker not found"
    });
  }

  worker.plan = {
    name: planName,
    weeklyPremium: Number(weeklyPremium),
    activatedAt: new Date().toISOString()
  };

  res.json({
    message: "Plan activated successfully",
    worker
  });
});

// GET ALL USERS (for testing)
app.get("/users", (req, res) => {
  res.json(users);
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});