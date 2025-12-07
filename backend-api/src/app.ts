import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import financeRoutes from "./routes/financeRoutes";
import savingsRoutes from "./routes/savingsRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------
// ⭐ CORS Configuration
// ----------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://capstack-2k25-frontend.onrender.com",
  "https://capstack-2k25.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS rejected origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Allow preflight
app.options("*", cors());

// ----------------------------------
// Middleware
// ----------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ----------------------------------
// Health Check
// ----------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend API running successfully",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || "1.0.0",
  });
});

// ----------------------------------
// Routes
// ----------------------------------
app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);
app.use("/savings", savingsRoutes);
app.use("/user", userRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "CAPSTACK Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      auth: "/auth",
      finance: "/finance",
      savings: "/savings",
      user: "/user",
    },
  });
});

// ----------------------------------
// Error Handling
// ----------------------------------
// 404 handler - must be after all other routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// ----------------------------------
// Server Startup
// ----------------------------------
const server = app.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌍 Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.warn("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server shut down");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.warn("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Server shut down");
    process.exit(0);
  });
});

// Unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error({
    message: "Unhandled Rejection",
    reason,
    promise,
  });
});

export default app;
