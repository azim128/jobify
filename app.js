import express from "express";
import morgan from "morgan";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import cors from "cors";
import { limiter } from "./middleware/rateLimiterMiddleware.js";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(limiter);

// routes
app.use("/api/v1/super-admin", superAdminRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/upload", uploadRoutes);

// health check
app.get("/health", (req, res) => {
  res.send("OK");
});

// not found middleware and global error handler
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
