import express from "express";
import { protect, restrictTo } from "../Controllers/authController.js";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  downloadResume,
  moveToEmployee,
} from "../Controllers/candidateController.js";
import multer from "multer";
import { storage } from "../utils/cloudinary.js";

const router = express.Router();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.use(protect, restrictTo("HR", "Admin"));

router.post("/", upload.single("resume"), createCandidate);
router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);
router.patch("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);
router.get("/:id/resume", downloadResume);
router.post("/:id/move-to-employee", moveToEmployee);

export default router;
