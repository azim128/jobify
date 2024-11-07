import api from "./apiConfig";

export const createCompany = (companyData, token) =>
  api.post("/company", companyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const updateCompany = (companyId, companyData, token) =>
  api.patch(`/company/${companyId}`, companyData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const getCompanyList = (token) =>
  api.get("/company/", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCompanyDetails = (companyId, token) =>
  api.get(`/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCompany = (companyId, token) =>
  api.delete(`/company/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
