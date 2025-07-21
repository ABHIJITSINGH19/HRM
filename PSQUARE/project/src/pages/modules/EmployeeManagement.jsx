import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import Header from "../../components/Header";
import Dropdown from "../../components/Dropdown";
import EditOverlay from "../../components/EditOverlay";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  deleteEmployee,
} from "../../redux/slice/employeesSlice";
import profileImg from "../../assets/profileImg.png";

const EmployeeManagement = () => {
  const [selectedPosition, setSelectedPosition] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useDispatch();
  const {
    data: employees,
    isLoading,
    isError,
    errorMessage,
  } = useSelector((state) => state.employeesList);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 2000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchEmployees({ search: debouncedSearch, position: selectedPosition })
    );
  }, [dispatch, debouncedSearch, selectedPosition]);

  const filteredEmployees = Array.isArray(employees) ? employees : [];

  const handleMenuOpen = (event, employeeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditEmployee = () => {
    handleMenuClose();
    setShowEditModal(true);
  };

  const handleDeleteEmployee = async () => {
    handleMenuClose();
    if (!selectedEmployeeId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmed) return;
    try {
      await dispatch(deleteEmployee(selectedEmployeeId)).unwrap();
      dispatch(
        fetchEmployees({ search: searchTerm, position: selectedPosition })
      );
    } catch (err) {
      alert("Failed to delete employee: " + err);
    }
    setSelectedEmployeeId(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedEmployeeId(null);
  };

  const handleEditSuccess = () => {
    dispatch(
      fetchEmployees({ search: searchTerm, position: selectedPosition })
    );
    handleCloseEditModal();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-GB");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600 font-semibold">
        {errorMessage || "Error loading employees."}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-0 bg-white">
      <div className="w-[95%] mx-auto h-full flex flex-col">
        <div className="rounded-t-2xl mb-4">
          <Header
            className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 sm:px-6 gap-2 sm:gap-0"
            style={{ gap: 0 }}
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Dropdown
                  options={["Designer", "Developer", "Human Resource"]}
                  value={selectedPosition}
                  onChange={setSelectedPosition}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? (
                      selected
                    ) : (
                      <span style={{ color: "#A4A4A4" }}>Position</span>
                    )
                  }
                />
              </div>
            </div>
            <div
              className="flex items-center gap-2 sm:gap-4 ml-0 sm:ml-auto w-full sm:w-auto"
              style={{ height: 38 }}
            >
              <div className="relative w-full sm:w-[240px] h-[38px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full pl-10 pr-4 py-2 bg-white border border-[#A4A4A4] text-sm sm:text-base"
                  style={{
                    borderRadius: 50,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft: 40,
                    paddingRight: 16,
                  }}
                />
              </div>
            </div>
          </Header>
        </div>
        <div className="rounded-b-2xl shadow-lg p-0 overflow-x-auto w-full ml-0">
          <div className="min-w-[600px] sm:min-w-0 overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-purple-800">
                <tr>
                  <th className="px-2 sm:px-6 py-3 sm:py-5 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider rounded-tl-2xl">
                    Profile
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider">
                    Date of Joining
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left text-xs sm:text-xs font-medium text-white uppercase tracking-wider rounded-tr-2xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <img
                        src={profileImg}
                        alt={employee.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {employee.phone}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {employee.position}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {employee.department}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                      {formatDate(employee.dateOfJoining)}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, employee._id)}
                        size="small"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showEditModal && (
          <EditOverlay
            onClose={handleCloseEditModal}
            employeeId={selectedEmployeeId}
            onEditSuccess={handleEditSuccess}
          />
        )}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
                mt: 1,
                px: 1,
              },
            },
            list: { sx: { py: 1 } },
          }}
        >
          <MenuItem
            onClick={handleEditEmployee}
            className="flex items-center"
            sx={{
              borderRadius: 9999,
              my: 0.5,
              px: 2.5,
              py: 1.2,
              fontSize: 16,
              fontWeight: 500,
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent !important",
              color: "inherit",
              "&:hover": {
                backgroundColor: "#F3F0FF",
                fontWeight: 700,
                boxShadow: "0px 2px 8px rgba(124,58,237,0.08)",
              },
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Employee
          </MenuItem>
          <MenuItem
            onClick={handleDeleteEmployee}
            className="flex items-center"
            sx={{
              borderRadius: 9999,
              my: 0.5,
              px: 2.5,
              py: 1.2,
              fontSize: 16,
              fontWeight: 500,
              minHeight: 36,
              display: "flex",
              alignItems: "center",
              backgroundColor: "transparent !important",
              color: "inherit",
              "&:hover": {
                backgroundColor: "#F3F0FF",
                fontWeight: 700,
                boxShadow: "0px 2px 8px rgba(124,58,237,0.08)",
              },
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default EmployeeManagement;
