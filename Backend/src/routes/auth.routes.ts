import { Router } from "express";

import { login, changePassword, me, logout } from "../controllers/auth.controller";

import { authenticate } from "../middlewares/auth";
import { loginLimiter } from "../middlewares/rateLimit";
import { validateBody } from "../middlewares/validate";
import { loginSchema, changePasswordSchema } from "../validators/auth.validator";

const router = Router();

router.post("/login", loginLimiter, validateBody(loginSchema), login);

router.patch(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  changePassword,
);

router.get("/me", authenticate, me);

router.post("/logout", logout);

export default router;
