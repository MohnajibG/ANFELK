import axios from "axios";

const getBaseURL = () => {
  // Priorité aux variables Vercel (.env frontend)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Développement local
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000/api";
  }

  // Production
  return "https://site--ankelk--dnxhn8mdblq5.code.run/api";
};

// Jeton anti-CSRF reçu au login/me dans le corps JSON (jamais en cookie,
// jamais en localStorage) : gardé en mémoire, perdu au rechargement de page,
// ré-hydraté via /auth/me à chaque démarrage de l'app (voir AuthProvider).
let csrfToken: string | null = null;

export const setCsrfToken = (token: string | null) => {
  csrfToken = token;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  // L'authentification repose sur le cookie httpOnly posé par le backend :
  // withCredentials est indispensable pour qu'il parte avec chaque requête
  // cross-site (front Vercel / back Northflank).
  withCredentials: true,
});

// Ajout automatique du header anti-CSRF sur les requêtes qui modifient l'état
api.interceptors.request.use(
  (config) => {
    if (csrfToken && config.method && config.method !== "get") {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Gestion session expirée / changement de mot de passe obligatoire
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // /auth/me est appelé à chaque chargement de page pour vérifier si une
    // session existe : un 401 y est un état normal (visiteur non connecté),
    // pas une session expirée. AuthProvider le gère déjà lui-même — rediriger
    // ici en plus provoquerait une boucle de rechargement infinie sur /app.
    const isMeCheck = error.config?.url?.includes("/auth/me");

    if (
      error.response?.status === 401 &&
      !isMeCheck &&
      window.location.pathname !== "/app"
    ) {
      setCsrfToken(null);

      window.location.href = "/app";
    }

    if (
      error.response?.status === 403 &&
      error.response?.data?.code === "PASSWORD_CHANGE_REQUIRED" &&
      window.location.pathname !== "/change-password"
    ) {
      window.location.href = "/change-password";
    }

    return Promise.reject(error);
  },
);

export default api;
