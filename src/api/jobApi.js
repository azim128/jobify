import api from "./apiConfig";

export const createJob = (jobData, token) =>
  api.post("/job", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const generateJobDescription = (jobData, token) =>
  api.post("/ai/jobs/generate", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateJob = (jobId, jobData, token) =>
  api.patch(`/job/${jobId}`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getJobList = (token, page = 1, limit = 10) =>
  api.get(`/job?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getJobDetails = (jobId, token) =>
  api.get(`/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteJob = (jobId, token) =>
  api.delete(`/job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
