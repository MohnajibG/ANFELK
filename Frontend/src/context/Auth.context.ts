import { createContext } from "react";

import type { AuthUser, LoginPayload } from "../types/auth";

export type AuthContextType = {
  user: AuthUser | null;

  loading: boolean;

  login: (data: LoginPayload) => Promise<AuthUser>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
