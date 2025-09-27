import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Add route


import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import applicationRoutes from "./routes/application.js";
import adminRoutes from "./routes/admin.js";
import manageStudentsRoutes from "./routes/manageStudents.js";
import adminApplicationsRoutes from "./routes/adminApplications.js";
import adminReportsRoutes from "./routes/adminReports.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manageStudents", manageStudentsRoutes);
app.use("/api/admin/applications", adminApplicationsRoutes);
app.use("/api/admin/reports", adminReportsRoutes);



// Catch-all
app.use((req, res) => res.status(404).json({ msg: "Route not found" }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
