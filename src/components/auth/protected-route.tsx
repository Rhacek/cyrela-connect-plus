
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Protected route component to check authentication and role-based access
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { session, setSession, initialized } = useAuth();
  const [isLocallyVerifying, setIsLocallyVerifying] = useState(true);
  
  // Use the custom hook for session verification
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  
  // Setup periodic session check for authenticated users
  usePeriodicSessionCheck(isAuthorized);
  
  // Direct verification for session - runs even before useSessionVerification
  useEffect(() => {
    // Skip if useSessionVerification is ready or if we already have a session
    if (!isVerifying && !isLocallyVerifying) return;
    if (session && !isVerifying) {
      setIsLocallyVerifying(false);
      return;
    }
    
    const verifySessionDirectly = async () => {
      // If auth context isn't initialized yet, wait
      if (!initialized) {
        console.log("Auth context not initialized yet, waiting...");
        return;
      }
      
      if (!session) {
        console.log("Protected route accessed without session, checking with Supabase directly");
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error checking session:", error);
            setIsLocallyVerifying(false);
            return;
          }
          
          if (data.session) {
            console.log("Found session directly from Supabase:", data.session.user.id);
            // Update auth context with transformed user data
            const { transformUserData } = await import('@/utils/auth-utils');
            const userSession = transformUserData(data.session.user);
            setSession(userSession);
            
            // Try to immediately refresh the token to ensure it stays valid
            try {
              const { data: refreshData } = await supabase.auth.refreshSession();
              if (refreshData.session) {
                console.log("Session refreshed after restoration");
              }
            } catch (refreshError) {
              console.error("Error refreshing restored session:", refreshError);
            }
          }
          
          setIsLocallyVerifying(false);
        } catch (error) {
          console.error("Error checking direct session:", error);
          setIsLocallyVerifying(false);
        }
      } else {
        // We have a session, check if it's still valid by refreshing
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            console.error("Error refreshing session in protected route:", error);
            // Don't clear session here, let verification handle it
          } else if (data.session) {
            console.log("Session refreshed successfully in protected route");
          }
        } catch (refreshErr) {
          console.error("Error during session refresh in protected route:", refreshErr);
        }
        
        setIsLocallyVerifying(false);
      }
    };
    
    verifySessionDirectly();
  }, [session, setSession, initialized, isVerifying, isLocallyVerifying]);
  
  // Effect to log protected route access
  useEffect(() => {
    console.log(`Protected route accessed: ${location.pathname}`);
    console.log(`Session exists: ${!!session}, ID: ${session?.id}`);
    console.log(`Auth status: authorized=${isAuthorized}, verifying=${isVerifying || isLocallyVerifying}`);
    
    // Special logging for admin routes
    if (location.pathname.startsWith('/admin')) {
      console.log('Accessing admin route with session:', session);
      console.log('User role:', session?.user_metadata?.role);
      console.log('Allowed roles:', allowedRoles);
    }
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
