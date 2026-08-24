import { Router } from "express";

import { login, changePassword, me } from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth";
import { loginLimiter } from "../middlewares/rateLimit";

const router = Router();

router.post("/login", loginLimiter, login);

router.patch("/change-password", authenticate, changePassword);

router.get("/me", authenticate, me);

export default router;
