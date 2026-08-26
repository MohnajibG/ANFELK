import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  updateCategoryStatusController,
  deleteCategoryController,
} from "../controllers/category.controller";

import { authenticate } from "../middlewares/auth";
import { authorize } from "../middlewares/authorize";
import { validateBody } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
  updateStatusSchema,
} from "../validators/category.validator";

const router = Router();

/**
 * Toutes les routes Categories
 * nécessitent un admin connecté
 */
router.use(authenticate);
router.use(authorize("admin"));

/**
 * POST /api/categories
 * Créer une catégorie
 */
router.post("/", validateBody(createCategorySchema), createCategoryController);

/**
 * GET /api/categories
 * Liste des catégories
 */
router.get("/", getCategoriesController);

/**
 * GET /api/categories/:id
 * Détails d'une catégorie
 */
router.get("/:id", getCategoryByIdController);

/**
 * PATCH /api/categories/:id
 * Modifier une catégorie
 */
router.patch(
  "/:id",
  validateBody(updateCategorySchema),
  updateCategoryController,
);

/**
 * PATCH /api/categories/:id/status
 * Activer / Désactiver une catégorie
 */
router.patch(
  "/:id/status",
  validateBody(updateStatusSchema),
  updateCategoryStatusController,
);

/**
 * DELETE /api/categories/:id
 * Suppression logique
 */
router.delete("/:id", deleteCategoryController);

export default router;
