import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import financeRoutes from "./routes/financeRoutes";
import savingsRoutes from "./routes/savingsRoutes";
import userRoutes from "./routes/userRoutes";
import { scheduledJobsManager } from "./scripts/scheduledJobs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🌟 CORS MUST BE BEFORE EVERYTHING
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); // allow preflight

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);
app.use("/savings", savingsRoutes);
app.use("/user", userRoutes);

scheduledJobsManager.initializeJobs();
scheduledJobsManager.startAllJobs();

app.listen(PORT, () => console.log(`Backend running on ${PORT}`));
