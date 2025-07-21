import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    position: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    resume: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Scheduled", "Ongoing", "Selected", "Rejected"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
