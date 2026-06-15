import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { admissionRouter } from "./routes/admissionRoutes.js";

export const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://mandkecollege.com",
  "https://mandkecollege.com",
  "http://www.mandkecollege.com",
  "https://www.mandkecollege.com",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

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
  res.json({
    status: "ok",
    message: "Mandke College API Running",
  });
});

app.use("/api/admissions", admissionRouter);

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    message: "Unable to process the admission application",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : undefined,
  });
});
