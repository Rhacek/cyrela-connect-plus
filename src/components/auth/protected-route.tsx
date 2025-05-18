
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { session, loading, initialized } = useAuth();
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  const location = useLocation();
  
  // Debug logging for troubleshooting session issues
  useEffect(() => {
    console.log("ProtectedRoute state:", {
      path: location.pathname,
      sessionExists: !!session,
      sessionId: session?.id,
      userRole: session?.user_metadata?.role,
      loading,
      initialized,
      isVerifying,
      isAuthorized,
      allowedRoles
    });
  }, [session, loading, initialized, isVerifying, isAuthorized, location.pathname, allowedRoles]);
  
  // Check if the current path is a protected route
  const isProtectedRoute = location.pathname.startsWith('/broker') || 
                           location.pathname.startsWith('/admin');
  
  // Skip auth checks for client paths - they should remain public
  const isClientRoute = location.pathname.startsWith('/client');
  if (isClientRoute) {
    return children ? <>{children}</> : <Outlet />;
  }
  
  // Show loading state while verifying
  if (loading || isVerifying || !initialized) {
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
      
      // Redirect to auth page with return URL
      const returnUrl = encodeURIComponent(location.pathname);
      return <Navigate to={`/auth?redirect=${returnUrl}`} replace />;
    }
    
    // Only redirect to auth if this is a protected route
    if (isProtectedRoute) {
      const returnUrl = encodeURIComponent(location.pathname);
      return <Navigate to={`/auth?redirect=${returnUrl}`} replace />;
    }
    
    // If not a protected route, allow access
    return children ? <>{children}</> : <Outlet />;
  };

  // If not authorized, redirect appropriately
  if (isAuthorized === false && !location.pathname.startsWith("/client")) {
    return handleUnauthorizedAccess();
  }

  // Render the protected content
  return children ? <>{children}</> : <Outlet />;
};
