import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCompany,
  updateCompany,
  getCompanyList,
  getCompanyDetails,
  deleteCompany,
} from "../../api/companyApi";

const initialState = {
  companies: [],
  companyDetails: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (token, { rejectWithValue }) => {
    try {
      const response = await getCompanyList(token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);

export const fetchCompanyDetails = createAsyncThunk(
  "company/fetchCompanyDetails",
  async ({ companyId, token }, { rejectWithValue }) => {
    try {
      const response = await getCompanyDetails(companyId, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company details"
      );
    }
  }
);

export const createNewCompany = createAsyncThunk(
  "company/createNewCompany",
  async ({ companyData, token }, { rejectWithValue }) => {
    try {
      const response = await createCompany(companyData, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Company creation failed"
      );
    }
  }
);

export const updateExistingCompany = createAsyncThunk(
  "company/updateExistingCompany",
  async ({ companyId, companyData, token }, { rejectWithValue }) => {
    try {
      const response = await updateCompany(companyId, companyData, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Company update failed"
      );
    }
  }
);

export const deleteExistingCompany = createAsyncThunk(
  "company/deleteExistingCompany",
  async ({ companyId, token }, { rejectWithValue }) => {
    try {
      await deleteCompany(companyId, token);
      return companyId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Company deletion failed"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.companyDetails = action.payload;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateExistingCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(
          (comp) => comp._id === action.payload._id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(deleteExistingCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (comp) => comp._id !== action.payload
        );
      });
  },
});

export default companySlice.reducer;
