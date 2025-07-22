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
  async ({ formData, employee }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/leaves", {
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
            `Failed to create leave (status ${response.status})`
        );
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const newLeave = data.leave || data;

        return {
          ...newLeave,
          employee,
        };
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

export const downloadLeaveDocs = createAsyncThunk(
  "leaveList/downloadLeaveDocs",
  async ({ id, url, filename = "document.pdf" }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const fetchUrl = url || `http://localhost:4000/api/leaves/${id}/docs`;
      const response = await fetch(fetchUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        throw new Error(`Failed to download document (status ${response.status})`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      return { success: true };
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
      if (action.payload) {
        state.data.push(action.payload);
      }
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
    builder.addCase(downloadLeaveDocs.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(downloadLeaveDocs.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(downloadLeaveDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export default leaveSlice.reducer;
