import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// ----------------- Apply internship -----------------
router.post("/apply", async (req, res) => {
  try {
    const { studentUsername, internshipTitle, name, email, phone, resumeLink } = req.body;
    if (!studentUsername || !internshipTitle) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const newApp = new Application({ studentUsername, internshipTitle, name, email, phone, resumeLink });
    await newApp.save();
    res.status(201).json({ msg: "Application submitted successfully", application: newApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ----------------- Fetch all applications of a student -----------------
router.get("/student/:username", async (req, res) => {
  try {
    const apps = await Application.find({ studentUsername: req.params.username }).sort({ appliedAt: -1 });
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ----------------- Fetch all applications (for admin) -----------------
router.get("/all", async (req, res) => {
  try {
    const apps = await Application.find().sort({ appliedAt: -1 });
    res.json({ applications: apps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
