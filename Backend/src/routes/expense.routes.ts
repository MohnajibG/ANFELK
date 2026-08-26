import { Router } from "express";

import {
  createExpenseController,
  getExpensesController,
  deleteExpenseController,
} from "../controllers/expense.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import { createExpenseSchema } from "../validators/expense.validator";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.post("/", validateBody(createExpenseSchema), createExpenseController);
router.get("/", getExpensesController);
router.delete("/:id", deleteExpenseController);

export default router;
