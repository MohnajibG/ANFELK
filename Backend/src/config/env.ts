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
};

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
MONGO_URI        : ${env.MONGO_URI ? "✅ Loaded" : "❌ Missing"}
JWT_SECRET       : ✅ Loaded
ALLOWED_ORIGINS  : ${env.ALLOWED_ORIGINS.length ? env.ALLOWED_ORIGINS.join(", ") : "⚠️ Not set (CORS permissif)"}
====================================
`);
