import { Router } from "express";

import {
  getPublicServicesController,
  getPublicEmployeesController,
  getAvailabilityController,
  createOnlineAppointmentController,
} from "../controllers/public.controller";
import { publicLimiter } from "../middlewares/rateLimit";
import { validateBody } from "../middlewares/validate";
import { createOnlineAppointmentSchema } from "../validators/public.validator";

const router = Router();

router.use(publicLimiter);

/*
==================================
Services publics
==================================
*/

router.get(
  "/services",

  getPublicServicesController,
);

/*
==================================
Employés publics
==================================
*/

router.get(
  "/employees",

  getPublicEmployeesController,
);

/*
==================================
Créneaux disponibles
==================================
*/

router.get(
  "/availability",

  getAvailabilityController,
);

/*
==================================
Réservation online
==================================
*/

router.post(
  "/appointments",

  validateBody(createOnlineAppointmentSchema),
  createOnlineAppointmentController,
);

export default router;
