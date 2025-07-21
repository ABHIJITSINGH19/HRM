import User from "../Models/User.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ status: "success", results: users.length, users });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ status: "success", user });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ status: "success", user });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});
