import Attendance from "../Models/Attendance.js";
import Employee from "../Models/Employee.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const getAllAttendance = catchAsync(async (req, res, next) => {
  const allowedStatuses = [
    "present",
    "absent",
    "medical leave",
    "work from home",
  ];
  const { status, search } = req.query;

  if (status && !allowedStatuses.includes(status)) {
    return next(
      new AppError(
        'Status must be one of: "present", "absent", "medical leave", "work from home"',
        400
      )
    );
  }

  const query = [];

  query.push({
    $lookup: {
      from: "employees",
      localField: "employee",
      foreignField: "_id",
      as: "employeeData",
    },
  });

  query.push({
    $unwind: "$employeeData",
  });

  query.push({
    $match: { "employeeData.status": "present" },
  });

  if (status) {
    query.push({ $match: { status } });
  }

  if (search) {
    query.push({
      $match: {
        "employeeData.name": { $regex: search, $options: "i" },
      },
    });
  }

  query.push({
    $project: {
      _id: 1,
      employeeId: "$employeeData._id",
      name: "$employeeData.name",
      department: "$employeeData.department",
      position: "$employeeData.position",
      status: 1,
      profile: "$employeeData.profile",
      task: 1,
    },
  });

  const attendance = await Attendance.aggregate(query);

  if (attendance.length === 0 && !status && !search) {
    const allEmployees = await Employee.find({ status: "present" });
    const employeesWithAttendance = allEmployees.map((emp) => ({
      _id: emp._id,
      employeeId: emp._id,
      name: emp.name,
      department: emp.department,
      position: emp.position,
      status: "not marked",
      profile: emp.profile,
      task: "",
    }));

    res.status(200).json({
      status: "success",
      results: employeesWithAttendance.length,
      attendance: employeesWithAttendance,
    });
  } else {
    res.status(200).json({
      status: "success",
      results: attendance.length,
      attendance,
    });
  }
});

export const updateAttendance = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Status is required", 400));
  }

  const attendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate("employee");

  if (!attendance) {
    return next(new AppError("Attendance record not found", 404));
  }

  res.status(200).json({ status: "success", attendance });
});

export const upsertAttendanceByEmployee = catchAsync(async (req, res, next) => {
  const { employeeId, status } = req.body;
  if (!employeeId || !status) {
    return next(new AppError("Employee ID and status are required", 400));
  }

  const emp = await Employee.findOne({ _id: employeeId, status: "present" });
  if (!emp) {
    return next(
      new AppError("Only current employees can have attendance records", 400)
    );
  }

  const attendance = await Attendance.findOneAndUpdate(
    { employee: employeeId },
    { status },
    { new: true, runValidators: true, upsert: true }
  ).populate("employee");

  res.status(200).json({
    status: "success",
    attendance: {
      _id: attendance._id,
      employee: attendance.employee._id,
      name: attendance.employee.name,
      status: attendance.status,
    },
  });
});
