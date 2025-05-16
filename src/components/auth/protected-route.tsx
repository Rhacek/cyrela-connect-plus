
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { UserSession } from "@/types/auth";

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
    
    // Function to verify session directly with Supabase
    const verifySessionWithSupabase = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error verifying session with Supabase:", error);
          setIsAuthorized(false);
          return null;
        }
        
        if (data.session) {
          console.log("Session verified with Supabase:", data.session.user.id);
          return data.session;
        } else {
          console.log("No session found with Supabase direct check");
          setIsAuthorized(false);
          return null;
        }
      } catch (err) {
        console.error("Unexpected error verifying session:", err);
        setIsAuthorized(false);
        return null;
      }
    };
    
    // Main check for authorization
    const checkAuthorization = async () => {
      if (loading) {
        return; // Wait until loading is complete
      }
      
      // If no session in context, verify with Supabase directly
      let currentSession = session;
      
      if (!currentSession) {
        console.log("No session in context, verifying with Supabase directly");
        currentSession = await verifySessionWithSupabase();
      }
      
      if (!currentSession) {
        console.log("No valid session found, user will be redirected to /auth");
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
      // Handle different session types correctly
      let userRole: UserRole;
      
      if ('user' in currentSession) {
        // This is a Supabase Session
        userRole = currentSession.user.user_metadata.role as UserRole;
      } else {
        // This is our custom UserSession
        userRole = currentSession.user_metadata.role as UserRole;
      }
      
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
    };
    
    checkAuthorization();
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

  // If not authorized or no session, redirect to auth page
  if (!isAuthorized || !session) {
    console.log("Not authorized or no session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // If logged in and has permission, render the children
  return <>{children}</>;
}
