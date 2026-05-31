import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

export default function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user } = useAuth();

  // if (user === null) return <div>Loading...</div>; // wait for fetchCurrentUser

  if (!user) return <Navigate to="/signin" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/404" />;

  return children;
}

