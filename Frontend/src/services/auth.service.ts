import { authApi } from "../api/auth.api";
import { setCsrfToken } from "../api/axios";

import type { LoginPayload, AuthUser } from "../types/auth";

class AuthService {
  async login(data: LoginPayload): Promise<AuthUser> {
    const { csrf, user } = await authApi.login(data);

    setCsrfToken(csrf);

    return user;
  }

  async me(): Promise<AuthUser> {
    const { csrf, user } = await authApi.me();

    setCsrfToken(csrf);

    return user;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return authApi.changePassword(currentPassword, newPassword);
  }

  async logout() {
    try {
      await authApi.logout();
    } finally {
      setCsrfToken(null);
    }
  }
}

export const authService = new AuthService();
