import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLeaves = createAsyncThunk(
  "leaveList/fetchLeaves",
  async ({ search = "", status = "" } = {}, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      const res = await fetch(
        `http://localhost:4000/api/leaves?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch leaves");
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.leaves && Array.isArray(data.leaves)) return data.leaves;
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createLeave = createAsyncThunk(
  "leaveList/createLeave",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");

      let body;
      if (formData instanceof FormData) {
        body = formData;
      } else {
        body = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, value);
          }
        });
      }
      const response = await fetch("http://localhost:4000/api/leaves", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
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
            `Failed to create leave (status ${response.status})`
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

export const updateLeaveStatus = createAsyncThunk(
  "leaveList/updateLeaveStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/leaves/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
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
            `Failed to update leave status (status ${response.status})`
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

const leaveSlice = createSlice({
  name: "leaveList",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    errorMessage: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLeaves.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(fetchLeaves.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchLeaves.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(createLeave.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(createLeave.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(createLeave.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(updateLeaveStatus.fulfilled, (state, action) => {
      if (Array.isArray(state.data) && action.payload && action.payload._id) {
        const idx = state.data.findIndex((l) => l._id === action.payload._id);
        if (idx !== -1) {
          state.data[idx] = { ...state.data[idx], ...action.payload };
        }
      }
    });
    builder.addCase(updateLeaveStatus.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export default leaveSlice.reducer;
