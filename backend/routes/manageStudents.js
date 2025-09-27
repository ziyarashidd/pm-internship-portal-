import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// 🔹 Get all student applications (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔹 Update a student application
router.put("/:id", async (req, res) => {
  try {
    const updatedApp = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Application updated successfully", application: updatedApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🔹 Delete a student application
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ msg: "Application deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
