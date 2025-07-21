import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createLeave } from "../redux/slice/leaveSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchEmployees } from "../redux/slice/employeesSlice";

const LeaveOverlay = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { data: employees = [], isLoading: employeesLoading } = useSelector(
    (state) => state.employeesList
  );

  React.useEffect(() => {
    if (open) {
      dispatch(fetchEmployees());
    }
  }, [open, dispatch]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee: null,
      leaveDate: null,
      reason: "",
      designation: "",
      documents: null,
    },
  });

  if (!open) return null;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("employee", data.employee?._id || "");
    formData.append("employeeName", data.employee?.name || "");
    formData.append(
      "fromDate",
      data.leaveDate ? format(data.leaveDate, "MM/dd/yyyy") : ""
    );
    formData.append("reason", data.reason);
    formData.append("designation", data.designation);
    if (data.documents) {
      formData.append("docs", data.documents);
    }
    dispatch(createLeave(formData));
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-lg p-0">
        <div className="flex items-center justify-between bg-purple-900 rounded-t-3xl px-8 py-3">
          <h2 className="text-3xl font-medium text-white mx-auto">
            Add New Leave
          </h2>
          <button
            className="absolute right-8 top-3 text-white text-2xl hover:text-gray-300"
            onClick={handleCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form className="px-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Controller
                  name="employee"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      options={employees}
                      getOptionLabel={(option) => option.name || ""}
                      loading={employeesLoading}
                      isOptionEqualToValue={(option, value) =>
                        option._id === value._id
                      }
                      onChange={(_, value) => field.onChange(value)}
                      value={field.value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search Employee Name"
                          size="small"
                          variant="outlined"
                          error={!!errors.employee}
                          helperText={errors.employee?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "0.75rem",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6D28D9",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6D28D9",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#6D28D9",
                                },
                            },
                            "& .MuiInputLabel-root": {
                              color: "#6D28D9",
                              "&.Mui-focused": {
                                color: "#6D28D9",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </div>

              <div>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="leaveDate"
                    control={control}
                    rules={{ required: "Leave date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Leave Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            size: "small",
                            fullWidth: true,
                            variant: "outlined",
                            error: !!errors.leaveDate,
                            helperText: errors.leaveDate?.message,
                            sx: {
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "0.75rem",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#6D28D9",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#6D28D9",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "#6D28D9",
                                  },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#6D28D9",
                                "&.Mui-focused": {
                                  color: "#6D28D9",
                                },
                              },
                            },
                          },
                          popper: {
                            sx: {
                              "& .MuiPaper-root": {
                                boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
                                borderRadius: "1.5rem",
                                overflow: "hidden",
                                width: "320px",
                                minHeight: "280px",
                              },
                              "& .MuiPickersLayout-root": {
                                borderRadius: "1.5rem",
                                width: "100%",
                                height: "100%",
                              },
                              "& .MuiDayCalendar-root": {
                                borderRadius: "1.5rem",
                                width: "100%",
                                height: "100%",
                              },
                              "& .MuiPickersCalendarHeader-root": {
                                borderRadius: "1.5rem 1.5rem 0 0",
                                padding: "16px",
                              },
                              "& .MuiPickersDay-root": {
                                borderRadius: "50%",
                                width: "36px",
                                height: "36px",
                                "&.Mui-selected": {
                                  backgroundColor: "#6D28D9",
                                  color: "white",
                                },
                                "&.MuiPickersDay-today": {
                                  color: "#6D28D9",
                                  fontWeight: "bold",
                                },
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>

              <div>
                <TextField
                  id="reason"
                  label="Reason"
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                  {...register("reason", { required: "Reason is required" })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6D28D9",
                      "&.Mui-focused": {
                        color: "#6D28D9",
                      },
                      "& .MuiInputLabel-asterisk": {
                        color: "#ef4444",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <TextField
                  id="designation"
                  label="Designation"
                  required
                  fullWidth
                  size="small"
                  variant="outlined"
                  error={!!errors.designation}
                  helperText={errors.designation?.message}
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "0.75rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#6D28D9",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#6D28D9",
                      "&.Mui-focused": {
                        color: "#6D28D9",
                      },
                      "& .MuiInputLabel-asterisk": {
                        color: "#ef4444",
                      },
                    },
                  }}
                />
              </div>

              <div className="relative">
                <Controller
                  name="documents"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TextField
                        id="documents"
                        label="Documents"
                        value={value ? value.name : ""}
                        fullWidth
                        size="small"
                        variant="outlined"
                        slotProps={{
                          input: {
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <UploadFileIcon
                                  sx={{ color: "#6D28D9", cursor: "pointer" }}
                                  onClick={() =>
                                    document
                                      .getElementById("hidden-documents-input")
                                      .click()
                                  }
                                />
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "0.75rem",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#6D28D9",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#6D28D9",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#6D28D9",
                            },
                            cursor: "pointer",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#6D28D9",
                            "&.Mui-focused": {
                              color: "#6D28D9",
                            },
                          },
                        }}
                        onClick={() =>
                          document
                            .getElementById("hidden-documents-input")
                            .click()
                        }
                      />
                      <input
                        id="hidden-documents-input"
                        name="documents"
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          onChange(e.target.files[0]);
                        }}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "8rem",
                py: 1,
                borderRadius: "2rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                backgroundColor: "#6D28D9",
                "&:hover": { backgroundColor: "#5B21B6" },
                color: "#fff",
                textTransform: "none",
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveOverlay;
