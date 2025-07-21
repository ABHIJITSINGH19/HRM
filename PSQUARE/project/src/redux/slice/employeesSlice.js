import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployees = createAsyncThunk(
  "employeeList/fetchEmployees",
  async ({ search = "", position = "" } = {}, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (position) params.append("position", position);
      const res = await fetch(
        `http://localhost:4000/api/employees?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data.data && Array.isArray(data.data)) return data.data;
      if (data.employees && Array.isArray(data.employees))
        return data.employees;
      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employeeList/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/employees/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch employee");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  "employeeList/createEmployee",
  async (formData, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/employees", {
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
            `Failed to create employee (status ${response.status})`
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

export const updateEmployee = createAsyncThunk(
  "employeeList/updateEmployee",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/employees/${id}`,
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
            `Failed to update employee (status ${response.status})`
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

export const deleteEmployee = createAsyncThunk(
  "employeeList/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/employees/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorData;
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        throw new Error(
          (errorData && errorData.message) ||
            errorData ||
            `Failed to delete employee (status ${response.status})`
        );
      }

      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const employeesSlice = createSlice({
  name: "employeeList",
  initialState: {
    isLoading: false,
    data: [],
    isError: false,
    errorMessage: null,
    singleEmployee: null,
    singleEmployeeLoading: false,
    singleEmployeeError: false,
    singleEmployeeErrorMessage: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(getEmployeeById.pending, (state) => {
      state.singleEmployeeLoading = true;
      state.singleEmployeeError = false;
      state.singleEmployeeErrorMessage = null;
    });
    builder.addCase(getEmployeeById.fulfilled, (state, action) => {
      state.singleEmployeeLoading = false;
      state.singleEmployee = action.payload;
    });
    builder.addCase(getEmployeeById.rejected, (state, action) => {
      state.singleEmployeeLoading = false;
      state.singleEmployeeError = true;
      state.singleEmployeeErrorMessage = action.payload;
    });
    builder.addCase(createEmployee.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(createEmployee.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        state.data.push(action.payload);
      } else {
        state.data = [action.payload];
      }
    });
    builder.addCase(createEmployee.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
    builder.addCase(updateEmployee.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        const idx = state.data.findIndex((e) => e._id === action.payload._id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      }
    });
    builder.addCase(updateEmployee.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });

    builder.addCase(deleteEmployee.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.isLoading = false;
      if (Array.isArray(state.data)) {
        state.data = state.data.filter((e) => e._id !== action.payload);
      }
    });
    builder.addCase(deleteEmployee.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export default employeesSlice.reducer;
