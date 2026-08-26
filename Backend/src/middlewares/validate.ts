import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

/**
 * Valide req.body contre un schéma zod avant d'atteindre le contrôleur.
 * Remplace req.body par la valeur validée/transformée (coercions,
 * valeurs par défaut, trim...).
 */
export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
