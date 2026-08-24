import crypto from "crypto";

const TEMP_PASSWORD_CHARS =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";

/**
 * Génère un mot de passe temporaire aléatoire et unique (CSPRNG),
 * différent à chaque appel, pour éviter tout mot de passe par défaut prévisible.
 */
export const generateTemporaryPassword = (length = 12): string => {
  const bytes = crypto.randomBytes(length);

  let password = "";

  for (let i = 0; i < length; i++) {
    password += TEMP_PASSWORD_CHARS[bytes[i] % TEMP_PASSWORD_CHARS.length];
  }

  return password;
};

/**
 * Échappe les caractères spéciaux d'une chaîne pour une utilisation
 * sûre dans un $regex Mongo (évite l'injection d'opérateurs regex / ReDoS).
 */
export const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
