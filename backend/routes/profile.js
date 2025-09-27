import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Get profile
router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.json(user);
});

// Update profile
router.put("/", authMiddleware, async (req, res) => {
  const fields = ["name","phone","location","skills","linkedin","github","twitter"];
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ msg: "User not found" });

  fields.forEach(f => { if(req.body[f] !== undefined) user[f] = req.body[f]; });
  await user.save();
  res.json({ msg: "Profile updated", user });
});

export default router;
