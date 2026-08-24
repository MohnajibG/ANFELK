import { NextFunction, Request, Response } from "express";
import { INTERNAL_ERROR_MESSAGE } from "../utils/apiError";

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} introuvable`,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("UNHANDLED ERROR", err);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    success: false,
    message: INTERNAL_ERROR_MESSAGE,
  });
};
