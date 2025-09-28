import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/profile/login" replace />;
  }

  // If role is specified and user doesn't have that role, redirect to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
