import express from "express";
import User from "../models/User.js";
import Application from "../models/Application.js";

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    // Count total students
    const totalStudents = await User.countDocuments({ role: "Student" });

    // Count total unique internships from applications
    const totalInternships = await Application.distinct("internshipTitle").then(arr => arr.length);

    // Count total applications
    const totalInternshipsApplied = await Application.countDocuments();

    // Count applications by status
    const pendingApplications = await Application.countDocuments({ status: "Pending" });
    const acceptedApplications = await Application.countDocuments({ status: "Approved" });
    const rejectedApplications = await Application.countDocuments({ status: "Rejected" });
    const completedApplications = await Application.countDocuments({ status: "Completed" });


    res.json({
      totalStudents,
      totalInternships,
      totalInternshipsApplied,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
      completedApplications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
