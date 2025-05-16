
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { transformUserData } from "@/utils/auth-utils";
import { DashboardLoading } from "@/components/broker/dashboard/dashboard-loading";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, loading, setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  
  useEffect(() => {
    console.log("Protected route mounting. Path:", location.pathname);
    console.log("Auth state:", { 
      sessionExists: !!session, 
      loading, 
      allowedRoles 
    });
    
    let isMounted = true;
    
    // Function to verify session directly with Supabase
    const verifySessionWithSupabase = async () => {
      try {
        console.log("Verifying session with Supabase directly");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error verifying session with Supabase:", error);
          return null;
        }
        
        if (data.session) {
          console.log("Session verified with Supabase:", data.session.user.id);
          
          // If the session exists but not in our context, update the context
          if (!session && isMounted) {
            const userSession = transformUserData(data.session.user);
            setSession(userSession);
          }
          
          return transformUserData(data.session.user);
        } else {
          console.log("No session found with Supabase direct check");
          
          // Try session refresh as a last resort
          try {
            const { data: refreshData } = await supabase.auth.refreshSession();
            if (refreshData.session) {
              console.log("Session refreshed successfully");
              return transformUserData(refreshData.session.user);
            }
          } catch (refreshErr) {
            console.error("Error refreshing session:", refreshErr);
          }
          
          return null;
        }
      } catch (err) {
        console.error("Unexpected error verifying session:", err);
        return null;
      }
    };
    
    // Main check for authorization
    const checkAuthorization = async () => {
      // If already loading in auth context, wait
      if (loading) {
        console.log("Auth context is still loading, waiting...");
        return;
      }
      
      // If no session in context, verify with Supabase directly
      let currentSession = session;
      let verifiedWithSupabase = false;
      
      if (!currentSession) {
        console.log("No session in context, verifying with Supabase directly");
        const verifiedSession = await verifySessionWithSupabase();
        currentSession = verifiedSession;
        verifiedWithSupabase = true;
      }
      
      if (!currentSession) {
        console.log("No valid session found after verification");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we have a session but no allowed roles, it's protected but open to all
      if (!allowedRoles) {
        console.log("Route is protected but open to all authenticated users");
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // Check if user has permission based on role
      const userRole = currentSession.user_metadata.role;
      const hasPermission = allowedRoles.includes(userRole);
      
      console.log("Checking authorization:", {
        userRole,
        allowedRoles,
        hasPermission
      });
      
      if (!hasPermission) {
        console.log("User role not allowed, redirecting");
        
        if (isMounted) {
          toast.error("Você não tem permissão para acessar esta página");
          
          // Redirect based on role - FIX: Ensure consistent paths with trailing slash for admin
          switch (userRole) {
            case UserRole.ADMIN:
              navigate("/admin/", { replace: true }); // Add trailing slash for consistency
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
          setIsVerifying(false);
        }
      } else {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
      }
    };
    
    checkAuthorization();
    
    return () => {
      isMounted = false;
    };
  }, [session, loading, allowedRoles, navigate, location.pathname, setSession]);

  // Periodic verification of session while on protected routes
  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (isAuthorized) {
      // Verify session every 5 minutes
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.warn("Protected route: Session lost during periodic check");
            
            if (isMounted) {
              toast.error("Sua sessão expirou. Redirecionando para login...");
              navigate("/auth", { replace: true });
            }
          }
        } catch (err) {
          console.error("Error during periodic session check in protected route:", err);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthorized, navigate]);

  // Show loading screen while checking auth or determining authorization
  if (loading || isVerifying || isAuthorized === null) {
    return <DashboardLoading />;
  }

  // If not authorized or no session, redirect to auth page
  if (!isAuthorized || !session) {
    console.log("Not authorized or no session, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }

  // If logged in and has permission, render the children
  return <>{children}</>;
}
