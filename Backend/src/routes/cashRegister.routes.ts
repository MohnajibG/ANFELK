import { Router } from "express";

import {
  openCashRegisterController,
  closeCashRegisterController,
  getCurrentCashRegisterController,
  getCashRegisterByIdController,
  getCashRegisterHistoryController,
  adminOpenCashRegisterController,
  adminCloseCashRegisterController,
  finalizeCashRegisterController,
} from "../controllers/cashRegister.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  openCashRegisterSchema,
  closeCashRegisterSchema,
  adminOpenCashRegisterSchema,
  adminCloseCashRegisterSchema,
  finalizeCashRegisterSchema,
} from "../validators/cashRegister.validator";

const router = Router();

router.use(authenticate);

router.post(
  "/open",
  authorize("admin", "cashier"),
  validateBody(openCashRegisterSchema),
  openCashRegisterController,
);
router.patch(
  "/close",
  authorize("admin", "cashier"),
  validateBody(closeCashRegisterSchema),
  closeCashRegisterController,
);
router.get(
  "/current",
  authorize("admin", "cashier"),
  getCurrentCashRegisterController,
);
router.get("/history", authorize("admin"), getCashRegisterHistoryController);

router.post(
  "/admin/open",
  authorize("admin"),
  validateBody(adminOpenCashRegisterSchema),
  adminOpenCashRegisterController,
);
router.patch(
  "/:id/admin-close",
  authorize("admin"),
  validateBody(adminCloseCashRegisterSchema),
  adminCloseCashRegisterController,
);
router.patch(
  "/:id/finalize",
  authorize("admin"),
  validateBody(finalizeCashRegisterSchema),
  finalizeCashRegisterController,
);

router.get("/:id", authorize("admin"), getCashRegisterByIdController);

export default router;
