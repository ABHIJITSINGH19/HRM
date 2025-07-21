import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCandidates = createAsyncThunk(
  "candidateList/fetchCandidates",
  async (
    { search = "", status = "", position = "" } = {},
    { rejectWithValue }
  ) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (position) params.append("position", position);
      const res = await fetch(
        `http://localhost:4000/api/candidates?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.candidates && Array.isArray(data.candidates))
        return data.candidates;
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCandidate = createAsyncThunk(
  "candidateList/createCandidate",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/candidates", {
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
            `Failed to create candidate (status ${response.status})`
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

export const updateCandidate = createAsyncThunk(
  "candidateList/updateCandidate",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/candidates/${id}`,
        {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
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
            `Failed to update candidate (status ${response.status})`
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

const candidateSlice = createSlice({
  name: "candidateList",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    errorMessage: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCandidates.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(fetchCandidates.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchCandidates.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(createCandidate.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(createCandidate.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    });
    builder.addCase(createCandidate.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(updateCandidate.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(updateCandidate.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        const idx = state.data.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      }
    });
    builder.addCase(updateCandidate.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export default candidateSlice.reducer;
