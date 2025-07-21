import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { useDispatch, useSelector } from "react-redux";
import { createCandidate } from "../redux/slice/candidateSlice";

const textFieldProps = {
  fullWidth: true,
  size: "small",
  variant: "outlined",
  slotProps: {
    input: {
      sx: {
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
    },
    inputLabel: {
      sx: {
        color: "#6D28D9",
        "&.Mui-focused": {
          color: "#6D28D9",
        },
        "& .MuiInputLabel-asterisk": {
          color: "#ef4444",
        },
      },
    },
  },
};

const PageOverlay = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.candidateList
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: [],
      declaration: false,
    },
  });

  const declaration = watch("declaration");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("position", data.position);
    formData.append("experience", data.experience);
    formData.append("resume", data.resume);
    const resultAction = await dispatch(createCandidate(formData));
    if (createCandidate.fulfilled.match(resultAction)) {
      reset();
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    }
  };

  const handleResumeClick = () => {
    document.getElementById("hidden-resume-input").click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-lg p-0">
        <div className="flex items-center justify-between bg-purple-900 rounded-t-3xl px-8 py-3">
          <h2 className="text-3xl font-medium text-white mx-auto">
            Apply for Position
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
            <div className="mb-4 mt-2">
              <Controller
                name="fullName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="fullName"
                    label="Full Name"
                    required
                    error={!!errors.fullName}
                    helperText={errors.fullName ? "Full Name is required" : ""}
                    {...textFieldProps}
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
                    error={!!errors.email}
                    helperText={errors.email ? "Email is required" : ""}
                    {...textFieldProps}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be exactly 10 digits",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    required
                    error={!!errors.phone}
                    helperText={
                      errors.phone
                        ? errors.phone.message || "Phone Number is required"
                        : ""
                    }
                    {...textFieldProps}
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
                  <TextField
                    {...field}
                    id="position"
                    label="Position"
                    required
                    error={!!errors.position}
                    helperText={errors.position ? "Position is required" : ""}
                    {...textFieldProps}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="experience"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="experience"
                    label="Experience"
                    required
                    error={!!errors.experience}
                    helperText={
                      errors.experience ? "Experience is required" : ""
                    }
                    {...textFieldProps}
                  />
                )}
              />
            </div>

            <div className="relative mb-4 flex items-center">
              <input
                id="hidden-resume-input"
                name="resume"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => {
                  setValue("resume", e.target.files[0]);
                }}
              />

              <Controller
                name="resume"
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <div style={{ position: "relative", width: "100%" }}>
                    <TextField
                      id="resume"
                      label="Resume"
                      required
                      value={value ? value.name : ""}
                      inputProps={{
                        readOnly: true,
                        style: { paddingRight: 40 },
                      }}
                      onClick={handleResumeClick}
                      error={!!errors.resume}
                      helperText={errors.resume ? "Resume is required" : ""}
                      {...textFieldProps}
                    />
                    <UploadFileIcon
                      sx={{
                        color: "#6D28D9",
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "auto",
                      }}
                      onClick={handleResumeClick}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          <div className="flex items-center mt-4">
            <Controller
              name="declaration"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={!!field.value}
                      size="small"
                      sx={{
                        color: "#6D28D9",
                        "&.Mui-checked": { color: "#6D28D9" },
                      }}
                      required
                    />
                  }
                  label={
                    <span className="text-base text-gray-500">
                      I hereby declare that the above information is true to the
                      best of my knowledge and belief
                    </span>
                  }
                />
              )}
            />
          </div>
          {isError && (
            <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
          )}

          <div className="flex justify-center mt-4">
            <Button
              type="submit"
              disabled={!declaration || isLoading}
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
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageOverlay;
