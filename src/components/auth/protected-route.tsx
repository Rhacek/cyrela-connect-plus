
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Protected route component to check authentication and role-based access
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { session, initialized } = useAuth();
  const [isLocallyVerifying, setIsLocallyVerifying] = useState(true);
  
  // Use the custom hook for session verification
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  
  // Setup periodic session check for authenticated users
  usePeriodicSessionCheck(isAuthorized);
  
  // Simpler verification that relies more on the auth context
  useEffect(() => {
    // Skip if useSessionVerification is ready
    if (!isVerifying) {
      setIsLocallyVerifying(false);
      return;
    }
    
    // Wait for auth context to initialize
    if (!initialized) {
      console.log("Auth context not initialized yet, waiting...");
      return;
    }
    
    // We have a session, verification is complete
    setIsLocallyVerifying(false);
  }, [session, initialized, isVerifying]);
  
  // Effect to log protected route access
  useEffect(() => {
    console.log(`Protected route accessed: ${location.pathname}`);
    console.log(`Session exists: ${!!session}, ID: ${session?.id}`);
    console.log(`Auth status: authorized=${isAuthorized}, verifying=${isVerifying || isLocallyVerifying}`);
  }, [location.pathname, isAuthorized, isVerifying, session, allowedRoles, isLocallyVerifying]);
  
  // Show loading state while verifying
  if (isVerifying || isLocallyVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
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
    const searchParams = new URLSearchParams();
    searchParams.set('redirect', location.pathname);
    
    return <Navigate to={`/auth?${searchParams.toString()}`} replace />;
  }
  
  // If authorized, render the protected content
  return <>{children}</>;
}
