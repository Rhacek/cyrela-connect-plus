
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSessionVerification } from "@/hooks/use-session-verification";
import { usePeriodicSessionCheck } from "@/hooks/use-periodic-session-check";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/utils/auth-redirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Protected route component to check authentication and role-based access
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const { session, setSession } = useAuth();
  
  // Use the custom hook for session verification
  const { isAuthorized, isVerifying } = useSessionVerification(allowedRoles);
  
  // Setup periodic session check for authenticated users
  usePeriodicSessionCheck(isAuthorized);
  
  // Effect to check for session directly when entering protected routes
  useEffect(() => {
    const verifySessionDirectly = async () => {
      if (!session) {
        console.log("Protected route accessed without session, checking with Supabase directly");
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("Found session directly from Supabase:", data.session.user.id);
            // Update auth context
            const { transformUserData } = await import('@/utils/auth-utils');
            setSession(transformUserData(data.session.user));
          }
        } catch (error) {
          console.error("Error checking direct session:", error);
        }
      }
    };
    
    verifySessionDirectly();
  }, [session, setSession]);
  
  // Effect to log protected route access
  useEffect(() => {
    console.log(`Protected route accessed: ${location.pathname}`);
    console.log(`Session exists: ${!!session}, ID: ${session?.id}`);
    console.log(`Auth status: authorized=${isAuthorized}, verifying=${isVerifying}`);
    
    // Special logging for admin routes
    if (location.pathname.startsWith('/admin')) {
      console.log('Accessing admin route with session:', session);
      console.log('User role:', session?.user_metadata?.role);
      console.log('Allowed roles:', allowedRoles);
    }
  }, [location.pathname, isAuthorized, isVerifying, session, allowedRoles]);
  
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
