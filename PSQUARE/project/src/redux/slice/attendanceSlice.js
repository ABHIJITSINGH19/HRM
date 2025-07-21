import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAttendance = createAsyncThunk(
  "attendanceList/fetchAttendance",
  async ({ search = "", status = "" } = {}, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      const res = await fetch(
        `http://localhost:4000/api/attendance?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.attendance && Array.isArray(data.attendance))
        return data.attendance;
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAttendanceById = createAsyncThunk(
  "attendanceList/getAttendanceById",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/attendance/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch attendance record");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createAttendance = createAsyncThunk(
  "attendanceList/createAttendance",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/attendance", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorData;
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        throw new Error(
          (errorData && errorData.message) ||
            errorData ||
            `Failed to create attendance record (status ${response.status})`
        );
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
       
        const data = await response.text();
        return { message: data };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAttendance = createAsyncThunk(
  "attendanceList/updateAttendance",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/attendance/by-employee`,
        {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeId: id, ...updateData }),
        }
      );
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorData;
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        throw new Error(
          (errorData && errorData.message) ||
            errorData ||
            `Failed to update attendance record (status ${response.status})`
        );
      }
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return { message: await response.text() };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAttendance = createAsyncThunk(
  "attendanceList/deleteAttendance",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/attendance/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          (errorData && errorData.message) ||
            `Failed to delete attendance record (status ${response.status})`
        );
      }
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendanceList",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    errorMessage: null,
    singleAttendance: null,
    singleAttendanceLoading: false,
    singleAttendanceError: false,
    singleAttendanceErrorMessage: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAttendance.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(fetchAttendance.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchAttendance.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(getAttendanceById.pending, (state) => {
      state.singleAttendanceLoading = true;
      state.singleAttendanceError = false;
      state.singleAttendanceErrorMessage = null;
    });
    builder.addCase(getAttendanceById.fulfilled, (state, action) => {
      state.singleAttendanceLoading = false;
      state.singleAttendance = action.payload;
    });
    builder.addCase(getAttendanceById.rejected, (state, action) => {
      state.singleAttendanceLoading = false;
      state.singleAttendanceError = true;
      state.singleAttendanceErrorMessage = action.payload;
    });
    builder.addCase(createAttendance.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(createAttendance.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    });
    builder.addCase(createAttendance.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(updateAttendance.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(updateAttendance.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        const idx = state.data.findIndex((a) => a._id === action.payload._id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      }
    });
    builder.addCase(updateAttendance.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(deleteAttendance.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(deleteAttendance.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        state.data = state.data.filter((a) => a._id !== action.payload);
      }
    });
    builder.addCase(deleteAttendance.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export default attendanceSlice.reducer;
