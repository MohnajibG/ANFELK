import { Router } from "express";

import {
  createServiceController,
  getServicesController,
  getServiceByIdController,
  updateServiceController,
  updateServiceStatusController,
  deleteServiceController,
} from "../controllers/service.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createServiceSchema,
  updateServiceSchema,
  updateStatusSchema,
} from "../validators/service.validator";

const router = Router();

router.use(authenticate);

/**
 * GET /api/services
 * Utilisé par :
 * - Admin
 * - Caissier (POS)
 */
router.get("/", authorize("admin", "cashier"), getServicesController);

/**
 * GET /api/services/:id
 * Admin + Caissier
 */
router.get("/:id", authorize("admin", "cashier"), getServiceByIdController);

/**
 * Gestion services
 * Admin uniquement
 */
router.post(
  "/",
  authorize("admin"),
  validateBody(createServiceSchema),
  createServiceController,
);

router.patch(
  "/:id",
  authorize("admin"),
  validateBody(updateServiceSchema),
  updateServiceController,
);

router.patch(
  "/:id/status",
  authorize("admin"),
  validateBody(updateStatusSchema),
  updateServiceStatusController,
);

router.delete("/:id", authorize("admin"), deleteServiceController);

export default router;
