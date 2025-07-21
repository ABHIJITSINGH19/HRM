import Candidate from "../Models/Candidate.js";
import Employee from "../Models/Employee.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import path from "path";
import fs from "fs";

export const createCandidate = catchAsync(async (req, res, next) => {
  console.time("totalCreateCandidate");
  const { name, email, phone, position, experience } = req.body;
  if (!name || !email || !phone || !position || !experience) {
    return next(
      new AppError(
        "Name, email, phone, position, and experience are required",
        400
      )
    );
  }
  if (!req.file || !req.file.path) {
    return next(new AppError("Resume file is required", 400));
  }
  console.time("findDuplicate");
  const existingCandidate = await Candidate.findOne({
    $or: [{ email }, { phone }],
  });
  console.timeEnd("findDuplicate");
  if (existingCandidate) {
    return next(
      new AppError("Candidate with this email or phone already exists", 400)
    );
  }
  console.time("createCandidateDB");
  const candidate = await Candidate.create({
    name,
    email,
    phone,
    position,
    experience,
    resume: req.file.path,
  });
  console.timeEnd("createCandidateDB");
  console.timeEnd("totalCreateCandidate");
  res.status(201).json({ status: "success", candidate });
});

export const getAllCandidates = catchAsync(async (req, res, next) => {
  const { status, position, search } = req.query;
  const query = [];

  if (status) {
    query.push({ $match: { status } });
  }

  if (position) {
    query.push({ $match: { position } });
  }

  if (search) {
    query.push({
      $match: {
        name: { $regex: search, $options: "i" },
      },
    });
  }

  query.push({
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      phone: 1,
      position: 1,
      experience: 1,
      status: 1,
      resume: 1,
      createdAt: 1,
    },
  });

  const candidates = await Candidate.aggregate(query);
  res
    .status(200)
    .json({ status: "success", results: candidates.length, candidates });
});

export const getCandidateById = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError("Candidate not found", 404));
  }
  res.status(200).json({ status: "success", candidate });
});

export const updateCandidate = catchAsync(async (req, res, next) => {
  const allowedStatuses = [
    "New",
    "Scheduled",
    "Ongoing",
    "Selected",
    "Rejected",
  ];

  let candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError("Candidate not found", 404));
  }

  let employee = null;

  const status = req.body.status;
  if (status) {
    console.log("PATCH /api/candidates/:id?status=Selected called");
    console.log("Candidate found:", candidate);

    if (!allowedStatuses.includes(status)) {
      return next(new AppError("Invalid status value", 400));
    }

    if (status === "Selected") {
      const duplicateCandidate = await Candidate.findOne({
        email: candidate.email,
        _id: { $ne: candidate._id },
      });
      console.log("Duplicate candidate:", duplicateCandidate);

      if (duplicateCandidate) {
        return res.status(400).json({
          status: "fail",
          message: "Another candidate with this email already exists.",
        });
      }

      const existingEmployee = await Employee.findOne({
        email: candidate.email,
      });
      console.log("Existing employee:", existingEmployee);

      if (!existingEmployee) {
        try {
          employee = await Employee.create({
            profile: candidate.resume || "",
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            department: candidate.position || "General",
            role: "Employee",
            dateOfJoining: new Date(),
            status: "present",
          });
          console.log("Employee created:", employee);
        } catch (err) {
          console.error("Error creating employee:", err);
        }
      }
    }

    candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ status: "success", candidate, employee });
  }

  candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: "success", candidate });
});

export const deleteCandidate = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findByIdAndDelete(req.params.id);
  if (!candidate) {
    return next(new AppError("Candidate not found", 404));
  }
  res.status(204).json({ status: "success", data: null });
});

export const downloadResume = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate || !candidate.resume) {
    return next(new AppError("Resume not found", 404));
  }
  const resumePath = path.resolve(candidate.resume);
  if (!fs.existsSync(resumePath)) {
    return next(new AppError("Resume file does not exist", 404));
  }
  res.download(resumePath);
});

export const moveToEmployee = catchAsync(async (req, res, next) => {
  const candidate = await Candidate.findById(req.params.id);
  if (!candidate) {
    return next(new AppError("Candidate not found", 404));
  }
  if (candidate.status !== "Selected") {
    return next(
      new AppError(
        'Only candidates with status "Selected" can be moved to employees',
        400
      )
    );
  }
  const employee = await Employee.create({
    profile: candidate.resume || "",
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    position: candidate.position,
    department: candidate.position || "General",
    role: "Employee",
    dateOfJoining: new Date(),
    status: "present",
  });
  await candidate.deleteOne();
  res.status(201).json({ status: "success", employee });
});
