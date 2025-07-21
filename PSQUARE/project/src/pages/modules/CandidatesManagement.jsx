import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Download, Trash2 } from "lucide-react";
import { Menu, MenuItem, IconButton } from "@mui/material";
import Header from "../../components/Header";
import PageOverlay from "../../components/PageOverlay";
import Dropdown from "../../components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidates,
  updateCandidate,
} from "../../redux/slice/candidateSlice";

const CandidatesManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const dispatch = useDispatch();
  const {
    data: candidates,
    isLoading,
  } = useSelector((state) => state.candidateList);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 2000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchCandidates({
        search: debouncedSearch,
        status: selectedStatus,
        position: selectedPosition,
      })
    );
  }, [dispatch, debouncedSearch, selectedStatus, selectedPosition]);

  const handleMenuOpen = (event, candidateId) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    await dispatch(
      updateCandidate({ id: candidateId, updateData: { status: newStatus } })
    );
    dispatch(
      fetchCandidates({
        search: searchQuery,
        status: selectedStatus,
        position: selectedPosition,
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
                    "New",
                    "Scheduled",
                    "Ongoing",
                    "Selected",
                    "Rejected",
                  ]}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  displayEmpty
                  renderValue={(selected) =>
                    selected ? (
                      selected
                    ) : (
                      <span style={{ color: "#A4A4A4" }}>Status</span>
                    )
                  }
                />
              </div>

              <div className="relative">
                <Dropdown
                  options={["Designer", "Developer", "Human Resources"]}
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
              className="flex items-center gap-4 ml-auto"
              style={{ height: 38 }}
            >
              <div className="relative" style={{ width: 240, height: 38 }}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
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
                onClick={() => setShowAddModal(true)}
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
                Add Candidate
              </button>
            </div>
          </Header>
        </div>

        <div className="rounded-b-2xl shadow-lg p-0 overflow-hidden w-[100%] ml-0">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-purple-800">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-2xl">
                    Sr no.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Candidates Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    style={{ width: 220 }}
                  >
                    Position
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    style={{ width: 160 }}
                  >
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-2xl">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Array.isArray(candidates) &&
                  candidates.map((candidate, index) => (
                    <tr
                      key={candidate._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {candidate.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {candidate.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {candidate.phone}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-600"
                        style={{ width: 220 }}
                      >
                        {candidate.position}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm"
                        style={{ width: 160 }}
                      >
                        <div className="relative">
                          <Dropdown
                            options={[
                              "New",
                              "Scheduled",
                              "Ongoing",
                              "Selected",
                              "Rejected",
                            ]}
                            value={candidate.status}
                            onChange={(val) =>
                              handleStatusChange(candidate._id, val)
                            }
                            renderValue={(selected) => {
                              const getStatusColor = (status) => {
                                switch (status) {
                                  case "Scheduled":
                                    return "#FF8A00";
                                  case "Ongoing":
                                    return "#22C55E";
                                  case "Selected":
                                    return "#8B5CF6";
                                  case "Rejected":
                                    return "#EF4444";
                                  default:
                                    return "#6B7280";
                                }
                              };

                              return (
                                <span
                                  style={{ color: getStatusColor(selected) }}
                                >
                                  {selected}
                                </span>
                              );
                            }}
                            renderOption={(option) => {
                              const getStatusColor = (status) => {
                                switch (status) {
                                  case "Scheduled":
                                    return "#FF8A00";
                                  case "Ongoing":
                                    return "#22C55E";
                                  case "Selected":
                                    return "#8B5CF6";
                                  case "Rejected":
                                    return "#EF4444";
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {candidate.experience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <IconButton
                          onClick={(event) =>
                            handleMenuOpen(event, candidate._id)
                          }
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

        {showAddModal && (
          <PageOverlay
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              dispatch(
                fetchCandidates({
                  search: searchQuery,
                  status: selectedStatus,
                  position: selectedPosition,
                })
              );
              setShowAddModal(false);
            }}
          />
        )}

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
            onClick={handleMenuClose}
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
              "&:hover": {
                backgroundColor: "#F3F0FF",
                fontWeight: 700,
                boxShadow: "0px 2px 8px rgba(124,58,237,0.08)",
              },
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Resume
          </MenuItem>
          <MenuItem
            onClick={handleMenuClose}
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
              "&:hover": {
                backgroundColor: "#F3F0FF",
                fontWeight: 700,
                boxShadow: "0px 2px 8px rgba(124,58,237,0.08)",
              },
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Candidate
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default CandidatesManagement;
