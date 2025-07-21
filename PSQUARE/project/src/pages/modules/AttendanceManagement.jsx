import React, { useState, useEffect } from "react";
import { Search, MoreVertical, ChevronDown, Edit, Trash2 } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAttendance,
  updateAttendance,
} from "../../redux/slice/attendanceSlice";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import profileImg from "../../assets/profileImg.png";

function toTitleCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const statusOptions = ["Present", "Absent", "Medical Leave", "Work From Home"];

const AttendanceManagement = () => {
  const dispatch = useDispatch();
  const { data: attendanceData, isLoading } = useSelector(
    (state) => state.attendanceList
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  useEffect(() => {
    const filters = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (statusFilter && statusFilter !== "Status")
      filters.status = statusFilter.toLowerCase();
    dispatch(fetchAttendance(filters));
  }, [debouncedSearch, statusFilter, dispatch]);

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await dispatch(
        updateAttendance({
          id: employeeId,
          updateData: { status: newStatus.toLowerCase() },
        })
      );

      dispatch(fetchAttendance());
      console.log(
        "Status updated successfully for employee:",
        employeeId,
        "to:",
        newStatus
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen p-0 flex items-center justify-center">
        <div className="text-lg">Loading attendance data...</div>
      </div>
    );
  }

  const employees = attendanceData || [];

  const handleMenuOpen = (event, employeeId) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployeeId(employeeId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployeeId(null);
  };

  const handleEditEmployee = () => {
    console.log("Edit employee:", selectedEmployeeId);
    handleMenuClose();
  };

  const handleDeleteEmployee = () => {
    console.log("Delete employee:", selectedEmployeeId);
    handleMenuClose();
  };

  return (
    <div className="w-full h-screen p-0">
      <div className="w-[95%] mx-auto h-full flex flex-col">
        <div className="rounded-t-2xl mb-4">
          <Header
            className="w-full flex justify-between items-center px-6"
            style={{ gap: 0 }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Dropdown
                  options={[
                    "Present",
                    "Absent",
                    "Medical Leave",
                    "Work from Home",
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  displayEmpty
                  placeholder="Status"
                />
              </div>
            </div>

            <div
              className="flex items-center gap-4 ml-auto"
              style={{ height: 38 }}
            >
              <div className="relative" style={{ width: 240, height: 38 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-full pl-10 pr-4 py-2 bg-white border border-[#A4A4A4]"
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

        <div className="rounded-b-2xl shadow-lg p-0 overflow-hidden w-[100%] ml-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-800">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-2xl">
                    Profile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-2xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {employees.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr
                      key={employee._id || employee.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={profileImg}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate">
                        {employee.task || employee.currentTask || "--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Dropdown
                          options={statusOptions}
                          value={toTitleCase(employee.status) || "Present"}
                          onChange={(val) => {
                            if (statusOptions.includes(val)) {
                              handleStatusChange(employee.employeeId, val);
                            }
                          }}
                          renderValue={(selected) => {
                            const getStatusColor = (status) => {
                              switch (status) {
                                case "Present":
                                  return "#22C55E";
                                case "Absent":
                                  return "#EF4444";
                                case "Medical Leave":
                                  return "#F59E0B";
                                case "Work From Home":
                                  return "#3B82F6";
                                default:
                                  return "#6B7280";
                              }
                            };

                            return (
                              <span style={{ color: getStatusColor(selected) }}>
                                {selected}
                              </span>
                            );
                          }}
                          renderOption={(option) => {
                            const getStatusColor = (status) => {
                              switch (status) {
                                case "Present":
                                  return "#22C55E";
                                case "Absent":
                                  return "#EF4444";
                                case "Medical Leave":
                                  return "#F59E0B";
                                case "Work From Home":
                                  return "#3B82F6";
                                default:
                                  return "#6B7280";
                              }
                            };

                            return (
                              <span style={{ color: getStatusColor(option) }}>
                                {option}
                              </span>
                            );
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <IconButton
                          onClick={(event) =>
                            handleMenuOpen(event, employee._id || employee.id)
                          }
                          size="small"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
                mt: 1,
                px: 1,
              },
            },
            list: {
              sx: { py: 1 },
            },
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
            Delete Employee
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default AttendanceManagement;
