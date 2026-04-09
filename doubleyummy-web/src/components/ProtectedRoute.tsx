import type { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authStore } from "../stores/authStore";

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const token = authStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/login" state={{ returnTo: location.pathname }} replace />;
  }

  return <>{children}</>;
};
