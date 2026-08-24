import { Response } from "express";

export const INTERNAL_ERROR_MESSAGE =
  "Une erreur interne est survenue. Veuillez réessayer plus tard.";

/**
 * Répond avec un message générique (ne fuite jamais error.message au client)
 * tout en journalisant le détail côté serveur pour le debug.
 */
export const sendInternalError = (
  res: Response,
  error: unknown,
  context: string,
) => {
  console.error(context, error);

  return res.status(500).json({
    success: false,
    message: INTERNAL_ERROR_MESSAGE,
  });
};
