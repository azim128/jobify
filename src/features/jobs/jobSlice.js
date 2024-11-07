import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createJob,
  updateJob,
  getJobList,
  getJobDetails,
  deleteJob,
  generateJobDescription,
} from "../../api/jobApi";

const initialState = {
  jobs: [],
  jobDetails: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  },
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async ({ token, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getJobList(token, page, limit);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  "job/fetchJobDetails",
  async ({ jobId, token }, { rejectWithValue }) => {
    try {
      const response = await getJobDetails(jobId, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job details"
      );
    }
  }
);

export const createNewJob = createAsyncThunk(
  "job/createNewJob",
  async ({ jobData, token }, { rejectWithValue }) => {
    try {
      const response = await createJob(jobData, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Job creation failed"
      );
    }
  }
);

export const updateExistingJob = createAsyncThunk(
  "job/updateExistingJob",
  async ({ jobId, jobData, token }, { rejectWithValue }) => {
    try {
      const response = await updateJob(jobId, jobData, token);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Job update failed"
      );
    }
  }
);

export const deleteExistingJob = createAsyncThunk(
  "job/deleteExistingJob",
  async ({ jobId, token }, { rejectWithValue }) => {
    try {
      await deleteJob(jobId, token);
      return jobId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Job deletion failed"
      );
    }
  }
);

export const generateJobDescriptionAsync = createAsyncThunk(
  "job/generateJobDescription",
  async ({ jobData, token }, { rejectWithValue }) => {
    try {
      const response = await generateJobDescription(jobData, token);
      return response.data.data.jobDescription;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate job description"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalJobs: action.payload.totalJobs,
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.jobDetails = action.payload;
      })
      .addCase(createNewJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateExistingJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(deleteExistingJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(generateJobDescriptionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
