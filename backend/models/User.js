import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "Admin", "Employer"], required: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  skills: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  twitter: { type: String, default: "" },
});

export default mongoose.model("User", userSchema);
