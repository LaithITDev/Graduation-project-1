import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { readSession } from "../utils/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return readSession() ? <>{children}</> : <Navigate to="/register" replace />;
}
