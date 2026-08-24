import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const jsonHandler = (message: string) => (_req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message,
  });
};

/**
 * Limite globale de sécurité (anti-abus / DoS basique) sur toute l'API.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler("Trop de requêtes, veuillez réessayer plus tard"),
});

/**
 * Limite stricte sur la connexion pour ralentir le brute force.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: jsonHandler(
    "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes",
  ),
});

/**
 * Limite sur les routes publiques (réservation en ligne) pour éviter
 * le spam / scraping sans authentification.
 */
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler("Trop de requêtes, veuillez réessayer plus tard"),
});
