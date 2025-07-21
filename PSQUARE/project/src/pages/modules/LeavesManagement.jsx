import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLeaves,
  updateLeaveStatus,
  createLeave,
} from "../../redux/slice/leaveSlice";
import { Search, FileText } from "lucide-react";
import Dropdown from "../../components/Dropdown";
import Header from "../../components/Header";
import LeaveOverlay from "../../components/LeaveOverlay";
import profileImg from "../../assets/profileImg.png";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchEmployees } from "../../redux/slice/employeesSlice";
import { Badge } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";

const statusOptions = ["Approved", "Pending", "Rejected"];

const LeavesManagement = () => {
  const dispatch = useDispatch();
  const {
    data: leavesData,
    isLoading,
    isError,
    errorMessage,
  } = useSelector((state) => state.leaveList);
  const { data: employees = [] } = useSelector((state) => state.employeesList);
  const [statusFilter, setStatusFilter] = useState("Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(
      fetchLeaves({
        search: searchQuery,
        status: statusFilter !== "Status" ? statusFilter.toLowerCase() : "",
      })
    );
  }, [dispatch, searchQuery, statusFilter]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleSaveLeave = async (formData, employee) => {
    try {
      await dispatch(createLeave({ formData, employee })).unwrap();
      setShowAddLeaveModal(false);
    } catch (error) {
      console.error("Failed to add leave:", error);
    }
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await dispatch(
        updateLeaveStatus({ id: leaveId, status: newStatus.toLowerCase() })
      ).unwrap();
      dispatch(
        fetchLeaves({
          search: searchQuery,
          status: statusFilter !== "Status" ? statusFilter.toLowerCase() : "",
        })
      );
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };
  const approvedLeaves =
    leavesData?.filter((leave) => leave.status === "approved") || [];

  const highlightedDays = approvedLeaves.map((leave) =>
    dayjs(leave.fromDate).format("YYYY-MM-DD")
  );

  const displayedApprovedLeaves = selectedDate
    ? approvedLeaves.filter((leave) =>
        dayjs(leave.fromDate).isSame(selectedDate, "day")
      )
    : approvedLeaves;

  function CustomDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelected =
      !outsideCurrentMonth &&
      highlightedDays.indexOf(day.format("YYYY-MM-DD")) >= 0;

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? "1" : undefined}
        sx={
          isSelected
            ? {
                "& .MuiBadge-badge": {
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                  borderRadius: "50%",
                  minWidth: 16,
                  height: 16,
                  fontSize: 11,
                  fontWeight: 700,
                  top: 6,
                  right: 6,
                  boxShadow: "0 2px 8px rgba(124,58,237,0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                },
              }
            : {}
        }
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    );
  }
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
                  options={statusOptions}
                  value={statusFilter === "Status" ? "" : statusFilter}
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
              <button
                onClick={() => setShowAddLeaveModal(true)}
                className="text-white transition-colors"
                style={{
                  background: "#4D007D",
                  borderRadius: 50,
                  width: 189,
                  height: 38,
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 40,
                  paddingRight: 40,
                }}
              >
                Add Leave
              </button>
            </div>
          </Header>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <div className="rounded-b-2xl shadow-lg p-0 overflow-hidden w-[100%] ml-0">
              <div className="overflow-x-auto">
                <div className="bg-purple-800 text-white font-semibold px-6 py-4 text-lg rounded-t-2xl">
                  Applied Leaves
                </div>
                {isLoading ? (
                  <div className="p-6 text-center">Loading...</div>
                ) : isError ? (
                  <div className="p-6 text-center text-red-500">
                    {errorMessage}
                  </div>
                ) : (
                  <table className="min-w-full">
                    <thead className="bg-purple-800">
                      <tr>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider ">
                          Profile
                        </th>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-2 text-left text-xs font-medium text-white uppercase tracking-wider ">
                          Docs
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {Array.isArray(leavesData) && leavesData.length > 0 ? (
                        leavesData.map((leave) => (
                          <tr
                            key={leave._id || leave.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <img
                                src={leave.profile || profileImg}
                                alt={leave.employeeName || leave.name || "-"}
                                className="w-10 h-10 rounded-full"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {leave.employeeName ||
                                  leave.employee?.name ||
                                  leave.name ||
                                  "-"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {leave.designation ||
                                  leave.employee?.position ||
                                  leave.position ||
                                  "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {leave.fromDate || leave.date
                                  ? dayjs(leave.fromDate || leave.date).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {leave.reason || "-"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Dropdown
                                options={statusOptions}
                                value={
                                  leave.status
                                    ? leave.status.charAt(0).toUpperCase() +
                                      leave.status.slice(1)
                                    : "Pending"
                                }
                                onChange={(val) =>
                                  handleStatusChange(leave._id || leave.id, val)
                                }
                                displayEmpty
                                placeholder="Status"
                                renderValue={(selected) => {
                                  let color = "#F59E0B";
                                  if (selected === "Approved")
                                    color = "#22C55E";
                                  if (selected === "Rejected")
                                    color = "#EF4444";
                                  return (
                                    <span style={{ color, fontWeight: 300 }}>
                                      {selected}
                                    </span>
                                  );
                                }}
                                renderOption={(option) => {
                                  let color = "#F59E0B";
                                  if (option === "Approved") color = "#22C55E";
                                  if (option === "Rejected") color = "#EF4444";
                                  return (
                                    <span style={{ color, fontWeight: 300 }}>
                                      {option}
                                    </span>
                                  );
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {leave.docs ? (
                                <a
                                  href={leave.docs}
                                  className="text-purple-700 hover:text-purple-900"
                                  download
                                >
                                  <FileText className="h-5 w-5 mx-auto" />
                                </a>
                              ) : (
                                <span className="text-gray-300 text-lg">
                                  &ndash;
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="text-center py-6 text-gray-400"
                          >
                            No leaves found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="w-[350px] flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
              <div className="bg-purple-800 text-white font-semibold px-4 py-3 rounded-t-2xl">
                Leave Calendar
              </div>
              <div className="p-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newDate) => {
                      if (
                        selectedDate &&
                        dayjs(newDate).isSame(selectedDate, "day")
                      ) {
                        setSelectedDate(null);
                      } else {
                        setSelectedDate(newDate);
                      }
                    }}
                    slots={{ day: CustomDay }}
                  />
                </LocalizationProvider>
                <div className="mt-6">
                  <div className="font-semibold px-4 py-3 mb-2 text-purple-800 text-base">
                    Approved Leaves{" "}
                    {selectedDate &&
                      `for ${dayjs(selectedDate).format("MMM D")}`}
                  </div>
                  <div className="">
                    {displayedApprovedLeaves.length > 0 ? (
                      displayedApprovedLeaves.map((leave) => (
                        <div
                          key={leave._id || leave.id}
                          className="flex items-center gap-3 mb-4 last:mb-0"
                        >
                          <img
                            src={leave.profile || profileImg}
                            alt={
                              leave.employeeName ||
                              leave.employee?.name ||
                              leave.name ||
                              "-"
                            }
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {leave.employeeName ||
                                leave.employee?.name ||
                                leave.name ||
                                "-"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {leave.designation ||
                                leave.employee?.position ||
                                leave.position ||
                                "-"}
                            </div>
                          </div>
                          <div className="ml-auto text-xs text-gray-500">
                            {dayjs(leave.fromDate || leave.date).format(
                              "MMM D"
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-4">
                        {selectedDate
                          ? "No approved leaves on this date."
                          : "No approved leaves."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LeaveOverlay
          open={showAddLeaveModal}
          onClose={() => setShowAddLeaveModal(false)}
          onSave={handleSaveLeave}
        />
      </div>
    </div>
  );
};

export default LeavesManagement;
