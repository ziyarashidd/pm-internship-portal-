// routes/adminReports.js
import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

// GET /api/admin/reports/approved-applications
router.get("/approved-applications", async (req, res) => {
  try {
    // Fetch all applications with status "Approved"
    const applications = await Application.find({ status: "Approved" });

    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// PUT /api/admin/reports/update-application/:id
router.put("/update-application/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json({ application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating application", error: err.message });
  }
});

export default router;
