import { Response } from "express";
import { AuthRequest } from "../types/auth";
import { sendInternalError } from "../utils/apiError";

import {
  createExpense,
  getExpenses,
  deleteExpense,
} from "../services/expense.service";

export const createExpenseController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const expense = await createExpense({
      ...req.body,
      createdBy: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExpensesController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { from, to, type } = req.query;

    const expenses = await getExpenses({
      from: typeof from === "string" ? from : undefined,
      to: typeof to === "string" ? to : undefined,
      type: typeof type === "string" ? type : undefined,
    });

    return res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    return sendInternalError(res, error, "GET_EXPENSES_ERROR");
  }
};

export const deleteExpenseController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    await deleteExpense(req.params.id as string);

    return res.json({
      success: true,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
