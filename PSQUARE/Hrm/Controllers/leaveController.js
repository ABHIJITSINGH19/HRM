import Leave from "../Models/Leave.js";
import Employee from "../Models/Employee.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import path from "path";
import fs from "fs";

export const getAllLeaves = catchAsync(async (req, res, next) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.employee) filter.employee = req.query.employee;
  if (req.query.fromDate) {
    filter.fromDate = { $gte: new Date(req.query.fromDate) };
  }
  if (req.query.search) {
    const employees = await Employee.find({
      name: { $regex: req.query.search, $options: "i" },
    }).select("_id");
    const employeeIds = employees.map((e) => e._id);
    filter.employee = { $in: employeeIds };
  }

  if (req.query.calendar === "true") {
    filter.status = "approved";
  }
  const leaves = await Leave.find(filter).populate("employee");

  const leavesWithDownloadUrl = leaves.map((leave) => {
    const leaveObj = leave.toObject();
    leaveObj.docsDownloadUrl = leave.docs
      ? `${req.protocol}://${req.get("host")}/api/leaves/${leave._id}/download`
      : null;
    return leaveObj;
  });
  res.status(200).json({
    status: "success",
    results: leaves.length,
    leaves: leavesWithDownloadUrl,
  });
});

export const getLeaveById = catchAsync(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id).populate("employee");
  if (!leave) {
    return next(new AppError("Leave not found", 404));
  }
  res.status(200).json({ status: "success", leave });
});

export const createLeave = catchAsync(async (req, res, next) => {
  console.time("totalCreateLeave");
  let { employee, employeeName, fromDate, reason, designation } = req.body;

  console.time("employeeLookupByName");
  if (!employee && employeeName) {
    const empByName = await Employee.findOne({
      name: employeeName,
      status: "present",
    });
    console.timeEnd("employeeLookupByName");
    if (!empByName) {
      console.timeEnd("totalCreateLeave");
      return next(
        new AppError("Employee with this name not found or not present", 400)
      );
    }
    employee = empByName._id;
  } else {
    console.timeEnd("employeeLookupByName");
  }

  // Authorization Check
  if (req.user.role !== "HR" && req.user.role !== "Admin") {
    if (req.user.id !== employee) {
      console.timeEnd("totalCreateLeave");
      return next(new AppError("You can only create leave for yourself", 403));
    }
  }

  // Validation
  if (!employee || !fromDate || !reason || !designation) {
    console.timeEnd("totalCreateLeave");
    return next(
      new AppError(
        "Employee (or employeeName), fromDate, reason, and designation are required",
        400
      )
    );
  }

  if (!req.file || !req.file.path) {
    console.timeEnd("totalCreateLeave");
    return next(new AppError("Document file is required", 400));
  }

  // Date Format Validation
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dateRegex.test(fromDate)) {
    console.timeEnd("totalCreateLeave");
    return next(new AppError("fromDate must be in mm/dd/yyyy format", 400));
  }

  // Employee Existence Check
  console.time("employeeLookupById");
  const emp = await Employee.findOne({ _id: employee, status: "present" });
  console.timeEnd("employeeLookupById");
  if (!emp) {
    console.timeEnd("totalCreateLeave");
    return next(new AppError("Only present employees can take leaves", 400));
  }

  // Leave Creation
  console.time("leaveCreate");
  // Parse fromDate as UTC noon to avoid timezone issues
  const [month, day, year] = fromDate.split("/");
  const fromDateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const docs = req.file.path;
  const leave = await Leave.create({
    employee,
    fromDate: fromDateObj,
    docs,
    reason,
    designation,
  });
  console.timeEnd("leaveCreate");
  console.timeEnd("totalCreateLeave");
  res.status(201).json({ status: "success", leave });
});

export const updateLeave = catchAsync(async (req, res, next) => {
  if (req.user.role !== "HR" && req.user.role !== "Admin") {
    return next(
      new AppError("You do not have permission to update leaves", 403)
    );
  }

  const { status } = req.body;
  const allowedStatuses = ["approved", "rejected", "pending"];
  if (!status || !allowedStatuses.includes(status)) {
    return next(
      new AppError(
        "Only status can be updated and must be one of: approved, rejected, pending",
        400
      )
    );
  }

  const updateFields = Object.keys(req.body);
  if (updateFields.length > 1 || !updateFields.includes("status")) {
    return next(new AppError("Only status field can be updated", 400));
  }
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate("employee");
  if (!leave) {
    return next(new AppError("Leave not found", 404));
  }
  res.status(200).json({ status: "success", leave });
});

export const deleteLeave = catchAsync(async (req, res, next) => {
  const leave = await Leave.findByIdAndDelete(req.params.id);
  if (!leave) {
    return next(new AppError("Leave not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

export const downloadDocs = catchAsync(async (req, res, next) => {
  const leave = await Leave.findById(req.params.id);
  if (!leave || !leave.docs) {
    return next(new AppError("Document not found", 404));
  }
  const docsPath = path.resolve(leave.docs);
  if (!fs.existsSync(docsPath)) {
    return next(new AppError("Document file does not exist", 404));
  }
  res.download(docsPath);
});
