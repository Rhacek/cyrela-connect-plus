
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    console.log("Protected route component mounting. Path:", location.pathname);
    console.log("Protected route: session =", session?.id, "loading =", loading, "allowedRoles =", allowedRoles);
    
    if (!loading) {
      // Check authorization once loading is complete
      if (!session) {
        console.log("No session found, user will be redirected to /auth");
        setIsAuthorized(false);
        return;
      }
      
      // If we have a session but no allowed roles, it's a protected route but open to all roles
      if (!allowedRoles) {
        console.log("Route is protected but open to all authenticated users");
        setIsAuthorized(true);
        return;
      }
      
      // If we have a session and allowed roles, check if user has permission
      const userRole = session.user_metadata.role as UserRole;
      const hasPermission = allowedRoles.includes(userRole);
      console.log("User role:", userRole, "Has permission:", hasPermission);
      
      if (!hasPermission) {
        console.log("Role not allowed:", userRole, "Allowed roles:", allowedRoles);
        toast.error("Você não tem permissão para acessar esta página");
        
        // Redirect based on role
        switch (userRole) {
          case UserRole.ADMIN:
            navigate("/admin", { replace: true });
            break;
          case UserRole.BROKER:
            navigate("/broker/dashboard", { replace: true });
            break;
          case UserRole.CLIENT:
            navigate("/client/welcome", { replace: true });
            break;
          default:
            navigate("/auth", { replace: true });
            break;
        }
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [session, loading, allowedRoles, navigate, location.pathname]);

  // Show loading screen while checking auth or determining authorization
  if (loading || isAuthorized === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrela-red"></div>
          <p className="text-cyrela-gray-dark">Verificando autorização...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!session) {
    console.log("No session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // If not authorized, the useEffect will handle redirection
  if (!isAuthorized) {
    return null;
  }

  // If logged in and has permission, render the children
  return <>{children}</>;
}
