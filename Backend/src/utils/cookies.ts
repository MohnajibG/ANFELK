import { CookieOptions } from "express";
import { isProduction } from "../config/env";

export const AUTH_COOKIE_NAME = "token";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Front (Vercel) et back (Northflank) sont sur des domaines différents :
 * en production le cookie doit être cross-site (sameSite=none) et donc
 * obligatoirement Secure (exigence des navigateurs). En local, front et
 * back sont tous les deux sur "localhost" (même site au sens SameSite,
 * peu importe le port) et servis en HTTP, donc secure doit rester false.
 */
export const getAuthCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: SEVEN_DAYS_MS,
});

export const getClearCookieOptions = (): CookieOptions => {
  const { maxAge: _maxAge, ...rest } = getAuthCookieOptions();
  return rest;
};
