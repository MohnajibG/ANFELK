import { Router } from "express";

import {
  getPublicServicesController,
  getPublicEmployeesController,
  getAvailabilityController,
  createOnlineAppointmentController,
} from "../controllers/public.controller";
import { publicLimiter } from "../middlewares/rateLimit";

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

  createOnlineAppointmentController,
);

export default router;
