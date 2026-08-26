import { NextFunction, Response } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../types/auth";
import { AUTH_COOKIE_NAME } from "../utils/cookies";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token manquant",
      });
    }

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

    // Protection CSRF : le cookie d'authentification part automatiquement
    // avec toute requête cross-site, un site tiers pourrait donc déclencher
    // des actions à l'insu de l'utilisateur. Le front doit renvoyer le
    // jeton csrf (reçu au login/me dans le corps JSON, jamais en cookie)
    // dans le header X-CSRF-Token pour toute requête qui modifie l'état.
    if (!SAFE_METHODS.includes(req.method) && req.headers["x-csrf-token"] !== payload.csrf) {
      return res.status(403).json({
        success: false,
        message: "Session invalide (CSRF)",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      csrf: payload.csrf,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré",
    });
  }
};
