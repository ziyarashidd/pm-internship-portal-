import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  studentUsername: { type: String, required: true },
  internshipTitle: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  resumeLink: { type: String },
  status: { type: String, default: "Pending" }, // Added status field
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", applicationSchema);
