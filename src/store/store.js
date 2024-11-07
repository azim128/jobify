import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import companyReducer from "../features/company/companySlice";
import jobReducer from "../features/jobs/jobSlice";
import suadminReducer from "../features/superadmin/superAdminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    job: jobReducer,
    suadmin: suadminReducer,
  },
});

export default store;
