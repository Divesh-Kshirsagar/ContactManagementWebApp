import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Security Middleware
app.use(helmet());

// Common Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || "http://localhost:5173", 
  credentials: true 
}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("../public"));
app.use(cookieParser());

// Routes
app.use("/api/v1", contactRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error middleware (must be after all routes)
app.use(errorHandler);

export default app;