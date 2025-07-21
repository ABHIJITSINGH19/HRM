import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchStudents = createAsyncThunk(
  "studentList/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/v1/students/getAllStudents");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();

      if (
        data.data &&
        data.data.students &&
        Array.isArray(data.data.students)
      ) {
        return data.data.students;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.students && Array.isArray(data.students)) {
        return data.students;
      } else if (Array.isArray(data)) {
        return data;
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addStudent = createAsyncThunk(
  "studentList/addStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/students/createStudent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add student");
      }
      const data = await response.json();

      if (data.data) {
        return data.data;
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "studentList/updateStudent",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/students/updateStudent/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update student");
      }
      const data = await response.json();

      if (data.data) {
        return data.data;
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const studentSlice = createSlice({
  name: "studentList",
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudents.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(fetchStudents.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchStudents.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });

    builder.addCase(addStudent.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(addStudent.fulfilled, (state, action) => {
      state.isLoading = false;

      if (state.data && Array.isArray(state.data)) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    });
    builder.addCase(addStudent.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });

    builder.addCase(updateStudent.pending, (state) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(updateStudent.fulfilled, (state, action) => {
      state.isLoading = false;

      if (state.data && Array.isArray(state.data)) {
        const index = state.data.findIndex(
          (student) => student.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      }
    });
    builder.addCase(updateStudent.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });
  },
});

export default studentSlice.reducer;
