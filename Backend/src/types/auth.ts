import { Request } from "express";

import { UserRole } from "../models/User";

export type Role = UserRole;

export interface JwtPayload {
  id: string;
  role: Role;
  csrf: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    csrf: string;
  };
}
