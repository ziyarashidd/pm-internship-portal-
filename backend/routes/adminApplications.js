import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Approve application
router.put("/:id/approve", async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" }, // Save to DB
      { new: true }
    );
    if (!app) return res.status(404).json({ msg: "Application not found" });
    res.json({ msg: "Application approved", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Reject application
router.put("/:id/reject", async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" }, // Save to DB
      { new: true }
    );
    if (!app) return res.status(404).json({ msg: "Application not found" });
    res.json({ msg: "Application rejected", application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
