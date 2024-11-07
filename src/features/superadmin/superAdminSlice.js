import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  getActivityLogs,
} from "../../api/superAdminApi";

const initialState = {
  admins: [],
  adminDetails: null,
  activityLogs: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  },
};

// Async thunk for creating an admin
export const createAdminAsync = createAsyncThunk(
  "admin/createAdmin",
  async ({ adminData, token }, { rejectWithValue }) => {
    try {
      const response = await createAdmin(adminData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

// Async thunk for getting all admins
export const getAllAdminsAsync = createAsyncThunk(
  "admin/getAllAdmins",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getAllAdmins(token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admins"
      );
    }
  }
);

// Async thunk for getting a single admin
export const getSingleAdminAsync = createAsyncThunk(
  "admin/getSingleAdmin",
  async ({ adminId, token }, { rejectWithValue }) => {
    try {
      const response = await getSingleAdmin(adminId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin details"
      );
    }
  }
);

// Async thunk for updating an admin
export const updateAdminAsync = createAsyncThunk(
  "admin/updateAdmin",
  async ({ adminId, updatedData, token }, { rejectWithValue }) => {
    try {
      const response = await updateAdmin(adminId, updatedData, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

// Async thunk for deleting an admin
export const deleteAdminAsync = createAsyncThunk(
  "admin/deleteAdmin",
  async ({ adminId, token }, { rejectWithValue }) => {
    try {
      const response = await deleteAdmin(adminId, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// Async thunk for getting activity logs
export const getActivityLogsAsync = createAsyncThunk(
  "admin/getActivityLogs",
  async ({ token, ...params }, { rejectWithValue }) => {
    try {
      const response = await getActivityLogs(token, params);
      return {
        logs: response.data.data.logs,
        pagination: {
          currentPage: response.data.data.currentPage,
          totalPages: response.data.data.totalPages,
          totalLogs: response.data.data.totalLogs,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "suadmin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle create admin
      .addCase(createAdminAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.admins.push(action.payload.data);
      })
      .addCase(createAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle get all admins
      .addCase(getAllAdminsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAdminsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(getAllAdminsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle get single admin
      .addCase(getSingleAdminAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDetails = action.payload.data;
      })
      .addCase(getSingleAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle update admin
      .addCase(updateAdminAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDetails = action.payload.data;
      })
      .addCase(updateAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle delete admin
      .addCase(deleteAdminAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAdminAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = state.admins.filter(
          (admin) => admin._id !== action.meta.arg.adminId
        );
      })
      .addCase(deleteAdminAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle get activity logs
      .addCase(getActivityLogsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityLogsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(getActivityLogsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
