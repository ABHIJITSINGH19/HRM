import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parse, format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateEmployee, getEmployeeById } from "../redux/slice/employeesSlice";

const parseDate = (dateString) => {
  if (!dateString) return null;
  try {
    if (dateString.includes("T") || dateString.includes("Z")) {
      return new Date(dateString);
    }

    return parse(dateString, "MM/dd/yy", new Date());
  } catch {
    return null;
  }
};

const formatDate = (date) => {
  if (!date) return "";
  return format(date, "MM/dd/yy");
};

const textFieldInputSx = {
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
};

const textFieldLabelSx = {
  color: "#6D28D9",
  "&.Mui-focused": {
    color: "#6D28D9",
  },
  "& .MuiInputLabel-asterisk": {
    color: "#ef4444",
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: "0.75rem",
      marginTop: "4px",
      boxShadow: "0px 8px 32px rgba(0,0,0,0.16)",
      "& .MuiMenuItem-root": {
        borderRadius: 9999,
        my: 0.5,
        mx: 1,
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
          color: "#4D007D",
          fontWeight: 700,
          boxShadow: "0px 4px 16px rgba(124,58,237,0.16)",
        },
        "&.Mui-selected": {
          backgroundColor: "transparent",
          color: "#6D28D9",
          fontWeight: 500,
        },
      },
    },
  },
};

const selectSx = {
  borderRadius: "0.75rem",
  backgroundColor: "#ffffff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6D28D9",
    borderWidth: "1px",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6D28D9",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6D28D9",
  },
  "& .MuiSelect-icon": {
    color: "#6D28D9",
  },
};

const datePickerTextFieldSx = {
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
};

const datePickerPopperSx = {
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
};

const EditOverlay = ({ onClose, employeeId, onEditSuccess }) => {
  const dispatch = useDispatch();
  const {
    singleEmployee,
    singleEmployeeLoading,
    singleEmployeeError,
    singleEmployeeErrorMessage,
  } = useSelector((state) => state.employeesList);

  useEffect(() => {
    if (employeeId) {
      dispatch(getEmployeeById(employeeId));
    }
  }, [employeeId, dispatch]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      dateOfJoining: null,
    },
  });

  useEffect(() => {
    if (singleEmployee && singleEmployee.employee) {
      const employeeData = singleEmployee.employee;
      setValue("name", employeeData.name || "");
      setValue("email", employeeData.email || "");
      setValue("phone", employeeData.phone || "");
      setValue("department", employeeData.department || "");
      setValue("position", employeeData.position || "");
      const parsedDate = parseDate(employeeData.dateOfJoining);
      setValue("dateOfJoining", parsedDate || null);
    }
  }, [singleEmployee, setValue]);

  const onSubmit = async (data) => {
    const targetEmployeeId = employeeId || singleEmployee?.employee?._id;
    if (targetEmployeeId) {
      const updateData = {
        ...data,
        dateOfJoining: data.dateOfJoining ? formatDate(data.dateOfJoining) : "",
      };
      try {
        await dispatch(updateEmployee({ id: targetEmployeeId, updateData }));
        if (onEditSuccess) onEditSuccess();
      } catch (error) {}
    }
  };

  if (singleEmployeeLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg p-6">
          <div className="text-lg">Loading employee data...</div>
        </div>
      </div>
    );
  }

  if (singleEmployeeError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg p-6">
          <div className="text-lg text-red-600">
            Error loading employee: {singleEmployeeErrorMessage}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!singleEmployee || !singleEmployee.employee) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg p-6">
          <div className="text-lg text-red-600">
            Employee not found. EmployeeId: {employeeId}
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-lg p-0">
        <div className="flex items-center justify-between bg-purple-900 rounded-t-3xl px-8 py-3">
          <h2 className="text-3xl font-medium text-white mx-auto">
            Edit Employee
          </h2>
          <button
            className="absolute right-8 top-3 text-white text-2xl hover:text-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form className="px-8 py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="mb-4 mt-2">
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="Full Name"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: { sx: textFieldInputSx },
                      inputLabel: { sx: textFieldLabelSx },
                    }}
                  />
                )}
              />
            </div>

            <div className="mb-4 mt-2">
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: { sx: textFieldInputSx },
                      inputLabel: { sx: textFieldLabelSx },
                    }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="phone"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: { sx: textFieldInputSx },
                      inputLabel: { sx: textFieldLabelSx },
                    }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="department"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="department"
                    label="Department"
                    required
                    fullWidth
                    size="small"
                    variant="outlined"
                    slotProps={{
                      input: { sx: textFieldInputSx },
                      inputLabel: { sx: textFieldLabelSx },
                    }}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="position"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl fullWidth size="small" required>
                    <InputLabel sx={textFieldLabelSx}>Position</InputLabel>
                    <Select
                      {...field}
                      id="position"
                      label="Position*"
                      sx={selectSx}
                      MenuProps={selectMenuProps}
                    >
                      {[
                        "Intern",
                        "Full Time",
                        "Senior",
                        "Junior",
                        "Team Lead",
                      ].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="dateOfJoining"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Joining"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          required: true,
                          size: "small",
                          fullWidth: true,
                          variant: "outlined",
                          sx: datePickerTextFieldSx,
                        },
                        popper: { sx: datePickerPopperSx },
                      }}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              type="submit"
              disabled={singleEmployeeLoading}
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
              {singleEmployeeLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOverlay;
