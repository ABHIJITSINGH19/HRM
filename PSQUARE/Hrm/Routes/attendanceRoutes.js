import express from "express";
import {
  getAllAttendance,
  updateAttendance,
  upsertAttendanceByEmployee,
} from "../Controllers/attendanceController.js";
import { protect, restrictTo } from "../Controllers/authController.js";

const router = express.Router();

router.use(protect, restrictTo("HR", "Admin"));

router.get("/", getAllAttendance);
router.patch("/by-employee", upsertAttendanceByEmployee);
router.patch("/:id", updateAttendance);

export default router;
