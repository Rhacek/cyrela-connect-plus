
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useSessionCache } from "@/hooks/use-session-cache";

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
  const { hasValidCache, updateSessionCache } = useSessionCache(location.pathname);
  
  // Use the custom hook for session verification
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  
  // Setup periodic session check for authenticated users with the current path
  usePeriodicSessionCheck(isAuthorized, location.pathname);
  
  // Simpler verification that relies more on the auth context
  useEffect(() => {
    // Skip verification if we have a valid cache
    if (hasValidCache) {
      console.log(`Using cached session validation for ${location.pathname}`);
      setIsLocallyVerifying(false);
      return;
    }
    
    // Skip if useSessionVerification is ready
    if (!isVerifying) {
      setIsLocallyVerifying(false);
      
      // If authorized, update the session cache for this path
      if (isAuthorized && session) {
        updateSessionCache(session, location.pathname);
      }
      
      return;
    }
    
    // Wait for auth context to initialize
    if (!initialized) {
      console.log("Auth context not initialized yet, waiting...");
      return;
    }
    
    // We have a session, verification is complete
    setIsLocallyVerifying(false);
    
    // If we have a session, update the cache
    if (session) {
      updateSessionCache(session, location.pathname);
    }
  }, [
    session, 
    initialized, 
    isVerifying, 
    location.pathname, 
    isAuthorized, 
    hasValidCache, 
    updateSessionCache
  ]);
  
  // Effect to log protected route access
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    
    console.log(`Protected route accessed: ${location.pathname}`);
    console.log(`Session exists: ${!!session}, ID: ${session?.id}`);
    console.log(`Auth status: authorized=${isAuthorized}, verifying=${isVerifying || isLocallyVerifying}`);
    
    // Log more detailed info for admin routes
    if (isAdminRoute) {
      console.log("Admin route detailed session info:", {
        user_metadata: session?.user_metadata,
        hasValidCache
      });
    }
  }, [location.pathname, isAuthorized, isVerifying, session, allowedRoles, isLocallyVerifying, hasValidCache]);
  
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
