import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "medical leave", "work from home"],
      required: true,
    },
    task: {
      type: String,
      required: false,
      trim: true,
    },

    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
