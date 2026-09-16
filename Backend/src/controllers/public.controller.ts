import { Request, Response } from "express";

import {
  getPublicServices,
  getPublicEmployees,
  getAvailability,
  createOnlineAppointment,
} from "../services/public.service";
import { sendInternalError } from "../utils/apiError";

/**
 * Services disponibles publiquement
 */
export const getPublicServicesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const services = await getPublicServices();

    res.json({
      success: true,

      services,
    });
  } catch (error) {
    sendInternalError(res, error, "GET_PUBLIC_SERVICES_ERROR");
  }
};

/**
 * Employés disponibles publiquement
 */
export const getPublicEmployeesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const employees = await getPublicEmployees();

    res.json({
      success: true,

      employees,
    });
  } catch (error) {
    sendInternalError(res, error, "GET_PUBLIC_EMPLOYEES_ERROR");
  }
};

/**
 * Disponibilité employé
 */
export const getAvailabilityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { employee, date } = req.query;

    if (typeof employee !== "string" || typeof date !== "string") {
      return res.status(400).json({
        success: false,

        message: "employee et date sont obligatoires",
      });
    }

    const availability = await getAvailability(employee, new Date(date));

    res.json({
      success: true,

      availability,
    });
  } catch (error) {
    sendInternalError(res, error, "GET_AVAILABILITY_ERROR");
  }
};

/**
 * Créer réservation online
 */
export const createOnlineAppointmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const appointment = await createOnlineAppointment({
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json({
      success: true,

      appointment,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,

      message: error.message,
    });
  }
};
