import express from "express";
import { register, login, protect } from "../Controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/protected", protect, (req, res) => {
  res
    .status(200)
    .json({
      message: `Hello, ${req.user.name}. You have accessed a protected route!`,
    });
});

export default router;
