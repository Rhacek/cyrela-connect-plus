
import { ReactNode, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Protected route: session =", session?.id, "loading =", loading, "allowedRoles =", allowedRoles);
    
    // If we have a session but no allowed roles, it's a protected route but open to all roles
    if (session && !allowedRoles) {
      console.log("Route is protected but open to all authenticated users");
    }
    
    // If we have a session and allowed roles, check if user has permission
    if (session && allowedRoles) {
      const userRole = session.user_metadata.role as UserRole;
      const hasPermission = allowedRoles.includes(userRole);
      console.log("User role:", userRole, "Has permission:", hasPermission);
    }
  }, [session, loading, allowedRoles]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrela-red"></div>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!session) {
    console.log("No session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // If allowedRoles is provided, check if user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(session.user_metadata.role as UserRole)) {
    console.log("Role not allowed:", session.user_metadata.role, "Allowed roles:", allowedRoles);
    
    // Redirect based on role
    switch (session.user_metadata.role) {
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      case UserRole.BROKER:
        return <Navigate to="/broker/dashboard" replace />;
      case UserRole.CLIENT:
        return <Navigate to="/client/welcome" replace />;
      default:
        return <Navigate to="/auth" replace />;
    }
  }

  // If logged in and has permission, render the children
  return <>{children}</>;
}
