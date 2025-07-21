import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
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
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    dateOfJoining: {
      type: Date,
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent"],
      default: "present",
    },
    profile: {
      type: String, 
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
