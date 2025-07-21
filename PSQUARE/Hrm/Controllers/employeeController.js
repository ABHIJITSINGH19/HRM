import Employee from "../Models/Employee.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllEmployees = catchAsync(async (req, res, next) => {
  const { position, search } = req.query;
  const query = [];

  if (position) {
    query.push({ $match: { position } });
  }

  if (search) {
    query.push({
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      },
    });
  }

  query.push({
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      department: 1,
      position: 1,
      role: 1,
      status: 1,
      dateOfJoining: 1,
      createdAt: 1,
    },
  });

  const employees = await Employee.aggregate(query);
  res
    .status(200)
    .json({ status: "success", results: employees.length, employees });
});

export const getEmployeeById = catchAsync(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(200).json({ status: "success", employee });
});

export const updateEmployee = catchAsync(async (req, res, next) => {
  const { name, email, phone, department, position } = req.body;
  if (!name || !email || !phone || !department || !position) {
    return next(
      new AppError(
        "Name, email, phone, department, and position are required",
        400
      )
    );
  }
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(200).json({ status: "success", employee });
});

export const deleteEmployee = catchAsync(async (req, res, next) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

export const assignRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!role) {
    return next(new AppError("Role is required", 400));
  }
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );
  if (!employee) {
    return next(new AppError("Employee not found", 404));
  }
  res.status(200).json({ status: "success", employee });
});
