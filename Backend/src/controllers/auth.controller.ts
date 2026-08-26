// src/controllers/auth.controller.ts

import crypto from "crypto";

import type { Request, Response } from "express";

import User from "../models/User";

import { comparePassword, hashPassword } from "../utils/hash";

import { generateToken } from "../utils/jwt";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearCookieOptions,
} from "../utils/cookies";

import type { AuthRequest } from "../types/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

const formatUser = (user: any) => ({
  _id: user._id.toString(),

  firstName: user.firstName,

  lastName: user.lastName,

  email: user.email,

  phone: user.phone,

  role: user.role,

  speciality: user.speciality,

  mustChangePassword: user.mustChangePassword,

  isActive: user.isActive,

  lastLogin: user.lastLogin,

  createdAt: user.createdAt,
});

/**
 * Login
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé",
      });
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      return res.status(423).json({
        success: false,
        message:
          "Compte temporairement verrouillé suite à plusieurs échecs de connexion. Réessayez plus tard.",
      });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      user.failedLoginAttempts = (user.failedLoginAttempts ?? 0) + 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
        user.failedLoginAttempts = 0;
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    const csrf = crypto.randomBytes(24).toString("hex");

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      csrf,
    });

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    return res.status(200).json({
      success: true,

      csrf,

      user: formatUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Changer mot de passe
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    const validPassword = await comparePassword(currentPassword, user.password);

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Ancien mot de passe incorrect",
      });
    }

    user.password = await hashPassword(newPassword);

    user.mustChangePassword = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mot de passe modifié",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Utilisateur connecté
 */
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    return res.status(200).json({
      success: true,

      csrf: req.user?.csrf,

      user: formatUser(user),
    });
  } catch (error) {
    console.error("ME ERROR", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Déconnexion : efface le cookie httpOnly côté navigateur.
 * Le JS front ne peut pas le lire ni le supprimer lui-même.
 */
export const logout = (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Déconnecté",
  });
};
