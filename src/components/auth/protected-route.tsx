
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { session, loading } = useAuth();
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  const location = useLocation();
  
  // Show loading state while verifying
  if (loading || isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  // Handle error redirection based on user role
  const handleUnauthorizedAccess = () => {
    // Check if attempting to access admin routes without permission
    if (location.pathname.startsWith('/admin') && session?.user_metadata?.role !== UserRole.ADMIN) {
      toast.error("Você não tem permissão para acessar esta página");
      
      // Redirect brokers to broker dashboard - but only if not already there
      if (session?.user_metadata?.role === UserRole.BROKER) {
        if (location.pathname !== "/broker/dashboard") {
          return <Navigate to="/broker/dashboard" replace />;
        }
        return <Navigate to="/auth" replace />;
      }
      
      // Redirect clients to client welcome page
      if (session?.user_metadata?.role === UserRole.CLIENT) {
        return <Navigate to="/client/welcome" replace />;
      }
      
      // Redirect other users to auth
      return <Navigate to="/auth" replace />;
    }
    
    // Only redirect to broker dashboard if at root broker path
    if (location.pathname === "/broker" && session?.user_metadata?.role === UserRole.BROKER) {
      return <Navigate to="/broker/dashboard" replace />;
    }
    
    // Default redirect to auth page
    return <Navigate to="/auth" replace />;
  };

  // If not authorized, redirect appropriately
  if (isAuthorized === false) {
    return handleUnauthorizedAccess();
  }

  // Render the protected content
  return children ? <>{children}</> : <Outlet />;
};
