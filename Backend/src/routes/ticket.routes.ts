import { Router } from "express";

import {
  createTicketController,
  getTicketsController,
  getTicketByIdController,
  cancelTicketController,
  updateTicketController,
  createTicketFromAppointment,
} from "../controllers/ticket.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createTicketSchema,
  createTicketFromAppointmentSchema,
  updateTicketAdminSchema,
} from "../validators/ticket.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(createTicketSchema),
  createTicketController,
);

router.get(
  "/",
  authenticate,
  authorize("admin", "cashier"),
  getTicketsController,
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "cashier"),
  getTicketByIdController,
);

router.patch(
  "/:id/cancel",
  authenticate,
  authorize("admin"),
  cancelTicketController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validateBody(updateTicketAdminSchema),
  updateTicketController,
);

router.post(
  "/appointment/:id/create-ticket",
  authenticate,
  authorize("admin", "cashier"),
  validateBody(createTicketFromAppointmentSchema),
  createTicketFromAppointment,
);

export default router;
