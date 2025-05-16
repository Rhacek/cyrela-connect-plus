
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Protected route component to check authentication and role-based access
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  
  // Use the custom hook for session verification
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  
  // Setup periodic session check for authenticated users
  usePeriodicSessionCheck(isAuthorized);
  
  // Effect to log protected route access
  useEffect(() => {
    console.log(`Protected route accessed: ${location.pathname}, authorized: ${isAuthorized}, verifying: ${isVerifying}`);
  }, [location.pathname, isAuthorized, isVerifying]);
  
  // Show loading state while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyrela-red"></div>
          <p className="text-sm text-cyrela-gray-dark">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // If not authorized, redirect to auth page
  if (!isAuthorized) {
    console.log("Not authorized, redirecting to /auth");
    
    // Show a toast when redirecting due to lack of authorization
    toast.error("Sessão expirada ou não autorizada", { 
      description: "Faça login novamente para continuar." 
    });
    
    // Save the current location so we can redirect back after login
    // Using URLSearchParams for better compatibility
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    
    return <Navigate to={`/auth?${searchParams.toString()}`} replace />;
  }
  
  // If authorized, render the protected content
  return <>{children}</>;
}
