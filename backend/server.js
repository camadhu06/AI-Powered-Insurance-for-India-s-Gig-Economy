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

// REGISTER API
app.post("/register", (req, res) => {
  const { name, city, income } = req.body;

  const user = {
    id: users.length + 1,
    name,
    city,
    income
  };

  users.push(user);

  res.json({
    message: "User registered successfully",
    user
  });
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

// GET ALL USERS (for testing)
app.get("/users", (req, res) => {
  res.json(users);
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});