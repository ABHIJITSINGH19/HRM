import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignRole,
} from "../Controllers/employeeController.js";
import { protect, restrictTo } from "../Controllers/authController.js";

const router = express.Router();

router.use(protect, restrictTo("HR", "Admin"));

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.patch("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.patch("/:id/role", assignRole);

export default router;
