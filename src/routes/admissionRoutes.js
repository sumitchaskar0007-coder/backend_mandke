import { Router } from "express";
import { createAdmission } from "../controllers/admissionController.js";
import { validateAdmission } from "../middleware/validateAdmission.js";

export const admissionRouter = Router();

admissionRouter.post("/", validateAdmission, createAdmission);
