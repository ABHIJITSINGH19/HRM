import { configureStore } from "@reduxjs/toolkit";
import studentList from "./slice/studentSlice";
import auth from "./slice/authSlice";
import candidateList from "./slice/candidateSlice";
import employeesList from "./slice/employeesSlice";
import attendanceList from "./slice/attendanceSlice";
import leaveList from "./slice/leaveSlice";

export const store = configureStore({
  reducer: {
    studentList,
    auth,
    candidateList,
    employeesList,
    attendanceList,
    leaveList,
  },
});
