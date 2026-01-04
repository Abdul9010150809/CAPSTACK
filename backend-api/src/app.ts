import express from "express";
import { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";
import authRoutes from "./routes/authRoutes";
import financeRoutes from "./routes/financeRoutes";
import savingsRoutes from "./routes/savingsRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { logger, requestIdMiddleware } from "./utils/logger";
import { metricsMiddleware, getMetrics } from "./utils/metrics";
import { config } from "./config/env";
import { optionalAuthMiddleware } from "./middleware/optionalAuthMiddleware";
import { getBenchmark } from "./controllers/financeController";

dotenv.config();

// Initialize Sentry
if (config.sentryDsn) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
}

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------
// ⭐ CORS Configuration
// ----------------------------------
// ⭐ CORS Configuration
// ----------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://capstack-2k25-frontend.onrender.com",
  "https://capstack-2k25.onrender.com",
  // Add environment variable support for custom deployment URLs
  process.env.FRONTEND_URL || "",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin?.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        // In development, be lenient
        if (process.env.NODE_ENV === 'development') {
          logger.warn(`CORS: Allowing origin in development mode: ${origin}`);
          return callback(null, true);
        }
        logger.warn(`CORS rejected origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
    maxAge: 86400, // 24 hours
  })
);

// Allow preflight
app.options("*", cors());

// ----------------------------------
// Middleware
// ----------------------------------

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request ID middleware
app.use(requestIdMiddleware);

// Metrics middleware
app.use(metricsMiddleware);

// Request logging middleware
app.use((req: any, res: any, next: any) => {
  logger.info(`${req.method} ${req.originalUrl}`, req.requestId);
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

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  try {
    const metrics = await getMetrics();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(metrics);
  } catch (error) {
    res.status(500).send('Error generating metrics');
  }
});

// ----------------------------------
// Routes
// ----------------------------------
app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);
app.use("/savings", savingsRoutes);
app.use("/user", userRoutes);

// ----------------------------------
// API Aliases (compat with frontend paths)
// ----------------------------------
const apiRouter = Router();
// Alias: /api/benchmarking -> /finance/benchmark
apiRouter.get("/benchmarking", optionalAuthMiddleware, getBenchmark);
app.use("/api", apiRouter);

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

// Sentry error handler - must be after all other error handlers
if (config.sentryDsn) {
  Sentry.setupExpressErrorHandler(app);
}

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
