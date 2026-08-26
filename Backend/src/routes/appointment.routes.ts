import { Router } from "express";

import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  rescheduleAppointmentController,
  deleteAppointmentController,
  cancelAppointmentController,
  completeAppointmentController,
  getWaitingPaymentAppointmentsController,
  payAppointmentController,
  getTodayAppointmentsController,
} from "../controllers/appointment.controller";

import {
  createRecurringAppointmentController,
  getRecurrenceOccurrencesController,
  cancelRecurrenceSeriesController,
} from "../controllers/recurrence.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  rescheduleAppointmentSchema,
} from "../validators/appointment.validator";
import { createRecurringAppointmentSchema } from "../validators/recurrence.validator";

const router = Router();

/**
 * Création rendez-vous
 */
router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(createAppointmentSchema),
  createAppointmentController,
);

/**
 * Liste rendez-vous
 */
router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getAppointmentsController,
);

/**
 * Création série récurrente
 */
router.post(
  "/recurring",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(createRecurringAppointmentSchema),
  createRecurringAppointmentController,
);

/**
 * Occurrences d'une série récurrente
 */
router.get(
  "/recurring/:groupId",
  authenticate,
  authorize("admin", "cashier", "employee"),
  getRecurrenceOccurrencesController,
);

/**
 * Annulation de toute une série récurrente (occurrences futures uniquement)
 */
router.patch(
  "/recurring/:groupId/cancel",
  authenticate,
  authorize("admin", "cashier"),
  cancelRecurrenceSeriesController,
);

/**
 * Rendez-vous en attente paiement POS
 */
router.get(
  "/waiting-payment",
  authenticate,
  authorize("admin", "cashier"),
  getWaitingPaymentAppointmentsController,
);

/**
 * Paiement rendez-vous POS
 */
router.patch(
  "/:id/pay",
  authenticate,
  authorize("admin", "cashier"),
  payAppointmentController,
);
/**
 * Recup les rdvs du jour
 */
router.get(
  "/today",
  authenticate,
  authorize("admin", "cashier"),
  getTodayAppointmentsController,
);
/**
 * Fin prestation employé
 */
router.patch(
  "/:id/complete",
  authenticate,
  authorize("employee", "admin"),
  completeAppointmentController,
);

/**
 * Annulation
 */
router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin", "cashier"),
  cancelAppointmentController,
);

/**
 * Modification
 */
router.patch(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(updateAppointmentSchema),
  updateAppointmentController,
);

/**
 * Déplacement rapide (drag-and-drop calendrier)
 */
router.patch(
  "/:id/reschedule",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(rescheduleAppointmentSchema),
  rescheduleAppointmentController,
);

/**
 * Suppression définitive
 */
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  deleteAppointmentController,
);

/**
 * Détail rendez-vous
 */
router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier", "employee"),
  getAppointmentByIdController,
);

export default router;
