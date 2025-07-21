import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./userController.js";
import User from "../Models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, phone } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return next(
      new AppError(
        "Name, email, password, and confirmPassword are required",
        400
      )
    );
  }
  if (typeof password !== "string" || password.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400));
  }
  if (password !== confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return next(new AppError("User already exists", 400));
  }

  if (phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return next(new AppError("User with this phone already exists", 400));
    }
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
    ...(phone && { phone }),
  });
  const token = signToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token!", 401));
  }
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists.", 401));
  }
  req.user = user;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
