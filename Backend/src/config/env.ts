import dotenv from "dotenv";

dotenv.config();

const parseOrigins = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  PORT: Number(process.env.PORT) || 3000,

  MONGO_URI: process.env.MONGO_URI || "",

  JWT_SECRET: process.env.JWT_SECRET || "",

  ALLOWED_ORIGINS: parseOrigins(process.env.ALLOWED_ORIGINS),

  NODE_ENV: process.env.NODE_ENV || "development",
};

export const isProduction = env.NODE_ENV === "production";

// L'authentification repose sur un cookie httpOnly cross-site (front et
// back sont sur des domaines différents) envoyé avec credentials: true.
// Sans liste blanche stricte, n'importe quel site pourrait faire des
// requêtes authentifiées à la place de l'utilisateur connecté.
if (isProduction && env.ALLOWED_ORIGINS.length === 0) {
  throw new Error(
    "ALLOWED_ORIGINS is missing in production. Set it before starting the server (CORS + cookies credentials).",
  );
}

// JWT_SECRET est indispensable à la sécurité des tokens :
// sans lui, un secret vide permettrait de forger n'importe quel token.
if (!env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is missing. Set it in the environment before starting the server.",
  );
}

// Debug uniquement au démarrage
console.log(`
====================================
⚙️ ENVIRONMENT CHECK
====================================
PORT             : ${env.PORT}
NODE_ENV         : ${env.NODE_ENV}${isProduction ? "" : " ⚠️ (cookies non-Secure, sameSite=lax)"}
MONGO_URI        : ${env.MONGO_URI ? "✅ Loaded" : "❌ Missing"}
JWT_SECRET       : ✅ Loaded
ALLOWED_ORIGINS  : ${env.ALLOWED_ORIGINS.length ? env.ALLOWED_ORIGINS.join(", ") : "⚠️ Not set (CORS permissif)"}
====================================
`);
