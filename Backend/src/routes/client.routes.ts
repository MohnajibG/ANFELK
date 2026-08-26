import { Router } from "express";

import {
  createClientController,
  getClientsController,
  getClientByIdController,
  updateClientController,
  updateClientStatusController,
  deleteClientController,
} from "../controllers/client.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createClientSchema,
  updateClientSchema,
  updateStatusSchema,
} from "../validators/client.validator";

const router = Router();

/**
 * Toutes les routes clients nécessitent une authentification
 */
router.use(authenticate);

/**
 * Créer un client
 *
 * Admin + Cashier
 */
router.post(
  "/",
  authorize("admin", "cashier"),
  validateBody(createClientSchema),
  createClientController,
);

/**
 * Liste clients
 *
 * Admin + Cashier
 */
router.get("/", authorize("admin", "cashier"), getClientsController);

/**
 * Détails client
 *
 * Admin + Cashier
 */
router.get("/:id", authorize("admin", "cashier"), getClientByIdController);

/**
 * Modifier client
 *
 * Admin + Cashier
 */
router.patch(
  "/:id",
  authorize("admin", "cashier"),
  validateBody(updateClientSchema),
  updateClientController,
);

/**
 * Activer / désactiver
 *
 * Admin uniquement
 */
router.patch(
  "/:id/status",
  authorize("admin"),
  validateBody(updateStatusSchema),
  updateClientStatusController,
);

/**
 * Suppression logique
 *
 * Admin uniquement
 */
router.delete("/:id", authorize("admin"), deleteClientController);

export default router;
