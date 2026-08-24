import { NextFunction, Response } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/auth";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken(token);

    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé",
      });
    }

    // Un compte doit changer son mot de passe avant d'accéder au reste de
    // l'API. Les routes /api/auth/* restent accessibles (me, change-password)
    // pour permettre ce changement.
    if (user.mustChangePassword && !req.originalUrl.startsWith("/api/auth/")) {
      return res.status(403).json({
        success: false,
        code: "PASSWORD_CHANGE_REQUIRED",
        message: "Vous devez changer votre mot de passe avant de continuer",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};
