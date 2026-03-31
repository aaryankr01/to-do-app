const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "https://to-do-app-nu-lovat-90.vercel.app", credentials: true }));
app.use(express.json());

/* ── MongoDB ─────────────────────────────────────────────── */
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskflow")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ── User Schema ─────────────────────────────────────────── */
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("User", userSchema);

/* ── Todo Schema ─────────────────────────────────────────── */
const todoSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text:      { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    priority:  { type: String, enum: ["high", "medium", "low"], default: "medium" },
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);

/* ── Auth Middleware ─────────────────────────────────────── */
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, unauthorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "supersecret123");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "supersecret123", { expiresIn: "7d" });

/* ── AUTH ROUTES ─────────────────────────────────────────── */

// SIGNUP
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already registered" });

    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET PROFILE
app.get("/api/auth/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

/* ── TODO ROUTES ─────────────────────────────────────────── */

// CREATE
app.post("/api/todos", protect, async (req, res) => {
  try {
    const { text, priority } = req.body;
    const todo = await Todo.create({ text, priority: priority || "medium", user: req.user.id });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL (for logged-in user)
app.get("/api/todos", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// TOGGLE COMPLETED
app.put("/api/todos/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Not found" });
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
app.delete("/api/todos/:id", protect, async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ── HEALTH ──────────────────────────────────────────────── */
app.get("/api/health", (_, res) => res.json({ status: "OK" }));

/* ── START ───────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
