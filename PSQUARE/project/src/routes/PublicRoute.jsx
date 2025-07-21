/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import AttendanceManagement from "../pages/modules/AttendanceManagement";
import CandidatesManagement from "../pages/modules/CandidatesManagement";
import EmployeeManagement from "../pages/modules/EmployeeManagement";
import LeavesManagement from "../pages/modules/LeavesManagement";
import Registration from "../pages/auth/Registration";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

const PublicRoute = () => {
  const [activeTab, setActiveTab] = useState("/");
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/attendance"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <AttendanceManagement />
            </Layout>
          }
        />
        <Route
          path="/candidates"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <CandidatesManagement />
            </Layout>
          }
        />
        <Route
          path="/employees"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <EmployeeManagement />
            </Layout>
          }
        />
        <Route
          path="/leaves"
          element={
            <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
              <LeavesManagement />
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
};

export default PublicRoute;
