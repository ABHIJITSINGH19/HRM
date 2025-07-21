import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leaveType: {
      type: String,
      
    },
    reason: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    fromDate: {
      type: Date,
      required: true,
    },
    docs: {
      type: String, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
