export type AuthRole = "admin" | "cashier" | "employee";

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: AuthRole;
  speciality?: string;
  mustChangePassword: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: AuthUser;
  csrf: string;
}

export type LoginResponse = AuthResponse;
