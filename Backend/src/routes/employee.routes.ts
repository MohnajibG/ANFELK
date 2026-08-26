import { NextFunction, Response, Router } from "express";

import {
  createEmployeeController,
  getEmployeesController,
  getMyEmployeeController,
  getEmployeeByIdController,
  updateEmployeeController,
  updateEmployeeStatusController,
  deleteEmployeeController,
} from "../controllers/employee.controller";

import {
  getScheduleController,
  updateScheduleController,
  addExceptionController,
  removeExceptionController,
} from "../controllers/employeeSchedule.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import { AuthRequest } from "../types/auth";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateStatusSchema,
  updateScheduleSchema,
  addExceptionSchema,
} from "../validators/employee.validator";

const router = Router();

/**
 * Autorise admin/cashier sur n'importe quel employé,
 * ou l'employé authentifié consultant ses propres horaires
 */
const selfOrStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Utilisateur non authentifié",
    });
  }

  if (
    req.user.role === "admin" ||
    req.user.role === "cashier" ||
    req.user.id === req.params.id
  ) {
    return next();
  }

  return res.status(403).json({ success: false, message: "Accès refusé" });
};

/**
 * Toutes les routes nécessitent un JWT valide
 */
router.use(authenticate);

/**
 * POST /api/employees
 *
 * Créer un employee ou cashier
 *
 * Admin uniquement
 */
router.post(
  "/",
  authorize("admin"),
  validateBody(createEmployeeSchema),
  createEmployeeController,
);

/**
 * GET /api/employees
 *
 * Liste des employés
 *
 * Accessible :
 * - Admin
 * - Cashier
 */
router.get("/", authorize("admin", "cashier"), getEmployeesController);

/**
 * GET /api/employees/me
 *
 * Profil utilisateur employé connecté
 *
 * Employee uniquement
 */
router.get("/me", getMyEmployeeController);
/**
 * GET /api/employees/:id
 *
 * Détail employé
 *
 * Accessible :
 * - Admin
 * - Cashier
 */
router.get("/:id", authorize("admin", "cashier"), getEmployeeByIdController);

/**
 * PATCH /api/employees/:id
 *
 * Modifier un employé
 *
 * Admin uniquement
 */
router.patch(
  "/:id",
  authorize("admin"),
  validateBody(updateEmployeeSchema),
  updateEmployeeController,
);

/**
 * PATCH /api/employees/:id/status
 *
 * Activer / désactiver un employé
 *
 * Admin uniquement
 */
router.patch(
  "/:id/status",
  authorize("admin"),
  validateBody(updateStatusSchema),
  updateEmployeeStatusController,
);

/**
 * DELETE /api/employees/:id
 *
 * Supprimer un employé
 *
 * Admin uniquement
 */
router.delete("/:id", authorize("admin"), deleteEmployeeController);

/**
 * GET /api/employees/:id/schedule
 *
 * Horaires de travail d'un employé
 *
 * Accessible : admin, cashier, ou l'employé lui-même
 */
router.get("/:id/schedule", selfOrStaff, getScheduleController);

/**
 * PUT /api/employees/:id/schedule
 *
 * Modifier les horaires hebdomadaires
 *
 * Admin uniquement
 */
router.put(
  "/:id/schedule",
  authorize("admin"),
  validateBody(updateScheduleSchema),
  updateScheduleController,
);

/**
 * POST /api/employees/:id/schedule/exceptions
 *
 * Ajouter une exception (congé, horaires réduits)
 *
 * Admin uniquement
 */
router.post(
  "/:id/schedule/exceptions",
  authorize("admin"),
  validateBody(addExceptionSchema),
  addExceptionController,
);

/**
 * DELETE /api/employees/:id/schedule/exceptions/:exceptionId
 *
 * Admin uniquement
 */
router.delete(
  "/:id/schedule/exceptions/:exceptionId",
  authorize("admin"),
  removeExceptionController,
);

export default router;
