import { Router } from "express";

import {
  getDashboardController,
  getEmployeeStatsController,
} from "../controllers/dashboard.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";

const router = Router();

/**
 * Dashboard utilisateur connecté
 */
router.get(
  "/",

  authenticate,

  getDashboardController,
);

/**
 * Détail admin d'un employé (chiffre d'affaires, prestations, planning)
 */
router.get(
  "/employee/:id",

  authenticate,
  authorize("admin"),

  getEmployeeStatsController,
);

export default router;
