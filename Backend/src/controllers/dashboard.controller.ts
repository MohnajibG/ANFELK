import { Response } from "express";

import { AuthRequest } from "../types/auth";

import {
  getAdminDashboard,
  getCashierDashboard,
  getEmployeeDashboard,
  getEmployeeDetailStats,
} from "../services/dashboard.service";
import { sendInternalError } from "../utils/apiError";

/**
 * Dashboard selon le rôle utilisateur
 */
export const getDashboardController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    let dashboard;

    switch (user.role) {
      case "admin": {
        const { period, date, startDate, endDate } = req.query;

        dashboard = await getAdminDashboard({
          period: typeof period === "string" ? period : undefined,
          date: typeof date === "string" ? date : undefined,
          startDate: typeof startDate === "string" ? startDate : undefined,
          endDate: typeof endDate === "string" ? endDate : undefined,
        });

        break;
      }

      case "cashier":
        dashboard = await getCashierDashboard(user.id);

        break;

      case "employee":
        dashboard = await getEmployeeDashboard(user.id, {
          date: typeof req.query.date === "string" ? req.query.date : undefined,
        });

        break;

      default:
        return res.status(403).json({
          success: false,
          message: "Rôle non autorisé",
        });
    }

    return res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error: unknown) {
    return sendInternalError(res, error, "GET_DASHBOARD_ERROR");
  }
};

/**
 * Détail admin d'un employé (chiffre d'affaires, prestations, planning)
 */
export const getEmployeeStatsController = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { period, date, startDate, endDate } = req.query;

    const stats = await getEmployeeDetailStats(req.params.id as string, {
      period: typeof period === "string" ? period : undefined,
      date: typeof date === "string" ? date : undefined,
      startDate: typeof startDate === "string" ? startDate : undefined,
      endDate: typeof endDate === "string" ? endDate : undefined,
    });

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: unknown) {
    return sendInternalError(res, error, "GET_EMPLOYEE_STATS_ERROR");
  }
};
