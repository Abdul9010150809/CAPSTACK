import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import financeRoutes from "./routes/financeRoutes";
import savingsRoutes from "./routes/savingsRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------
// ⭐ FIX: Render production URLs MUST BE WHITELISTED
// ----------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://capstack-2k25-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Allow preflight
app.options("*", cors());
app.use(express.json());

// -------------------------
// Routes
// -------------------------
app.use("/auth", authRoutes);
app.use("/finance", financeRoutes);
app.use("/savings", savingsRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
