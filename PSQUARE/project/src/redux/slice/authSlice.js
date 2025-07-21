import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to register");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to login");
      }
      const data = await response.json();
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const LOGOUT_TIMER_DURATION = 2 * 60 * 60 * 1000;
let logoutTimerId = null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoading: false,
    user: null,
    token: sessionStorage.getItem("token") || null,
    isError: false,
    errorMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      sessionStorage.removeItem("token");
      if (logoutTimerId) {
        clearTimeout(logoutTimerId);
        logoutTimerId = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user || null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;

      if (logoutTimerId) {
        clearTimeout(logoutTimerId);
      }
      if (action.payload.token) {
        logoutTimerId = setTimeout(() => {
          window.dispatchEvent(new Event("auto-logout"));
        }, LOGOUT_TIMER_DURATION);
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;

export function setLogoutTimer(dispatch) {
  window.addEventListener("auto-logout", () => {
    dispatch(logout());
  });
}

export default authSlice.reducer;
