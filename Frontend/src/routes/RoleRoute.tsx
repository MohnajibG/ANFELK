import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

type Role = "admin" | "cashier" | "employee";

interface RoleRouteProps {
  allowedRoles: Role[];
}

const dashboardByRole: Record<Role, string> = {
  admin: "/admin/dashboard",
  cashier: "/cashier/dashboard",
  employee: "/employee/dashboard",
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  const role = user.role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to={dashboardByRole[role]} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
