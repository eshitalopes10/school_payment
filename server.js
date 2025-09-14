const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Models
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String // hashed
}));

const Payment = mongoose.model("Payment", new mongoose.Schema({
  studentName: String,
  amount: Number,
  date: { type: Date, default: Date.now }
}));

// Auth middleware
function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Routes

// Register admin (run once)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: "Admin created" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected routes
app.get("/api/payments", auth, async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

app.post("/api/payments", auth, async (req, res) => {
  const { studentName, amount } = req.body;
  const payment = new Payment({ studentName, amount });
  await payment.save();
  res.json(payment);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
