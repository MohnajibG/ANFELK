import { Router } from "express";

import {
  createWaitlistEntryController,
  getWaitlistController,
  getWaitlistMatchesController,
  convertWaitlistEntryController,
  cancelWaitlistEntryController,
} from "../controllers/waitlist.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createWaitlistEntrySchema,
  convertWaitlistEntrySchema,
} from "../validators/waitlist.validator";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "cashier"));

router.post("/", validateBody(createWaitlistEntrySchema), createWaitlistEntryController);
router.get("/", getWaitlistController);
router.get("/matches", getWaitlistMatchesController);
router.post(
  "/:id/convert",
  validateBody(convertWaitlistEntrySchema),
  convertWaitlistEntryController,
);
router.patch("/:id/cancel", cancelWaitlistEntryController);

export default router;
