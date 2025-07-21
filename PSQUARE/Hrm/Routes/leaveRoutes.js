import express from "express";
import {
  getAllLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  downloadDocs,
} from "../Controllers/leaveController.js";
import { protect, restrictTo } from "../Controllers/authController.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.use(protect, restrictTo("HR", "Admin"));

router.get("/", getAllLeaves);
router.get("/:id", getLeaveById);
router.post("/", upload.single("docs"), createLeave);
router.patch("/:id", updateLeave);
router.delete("/:id", deleteLeave);
router.get("/:id/docs", downloadDocs);

export default router;
