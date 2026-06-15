import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { admissionRouter } from "./routes/admissionRoutes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://mandkecollege.com",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  "/api/admissions",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/admissions", admissionRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: "Unable to process the admission application",
  });
});
