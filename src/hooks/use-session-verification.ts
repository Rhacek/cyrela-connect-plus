
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { refreshSession } from "@/lib/supabase";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SessionVerificationResult {
  isAuthorized: boolean | null;
  isVerifying: boolean;
}

export function useSessionVerification(allowedRoles?: UserRole[]): SessionVerificationResult {
  const { session, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let checkTimeout: number | null = null;

    // Main check for authorization with retries
    const checkAuthorization = async (retryCount = 0) => {
      // If initialized is false, wait for it before proceeding
      if (!initialized && loading) {
        console.log("Auth context not yet initialized, will retry");
        if (isMounted && retryCount < 5) {
          checkTimeout = window.setTimeout(() => {
            checkAuthorization(retryCount + 1);
          }, 500);
        }
        return;
      }
      
      // If still loading in auth context, wait
      if (loading) {
        console.log("Auth context is still loading, waiting...");
        return;
      }
      
      console.log("Checking authorization with session:", {
        hasSession: !!session,
        sessionId: session?.id,
        userRole: session?.user_metadata?.role,
      });
      
      // If no session in context, try refresh once
      let currentSession = session;
      
      if (!currentSession) {
        console.log("No session in context, attempting refresh");
        
        const refreshedSession = await refreshSession();
        
        if (!refreshedSession) {
          console.log("No valid session found after refresh attempt");
          if (isMounted) {
            setIsAuthorized(false);
            setIsVerifying(false);
          }
          return;
        } else {
          // Session refresh will be handled by auth listeners
          console.log("Session refreshed in verification");
          
          // Wait briefly for auth context to update
          await new Promise(resolve => setTimeout(resolve, 500));
          currentSession = session;
        }
      }
      
      // If we have a session but no allowed roles, it's protected but open to all authenticated
      if (!allowedRoles && currentSession) {
        console.log("Route is protected but open to all authenticated users");
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we don't have a session after refresh attempts, not authorized
      if (!currentSession) {
        console.log("No valid session found after all checks");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // Check if user has permission based on role
      const userRole = currentSession.user_metadata.role;
      const hasPermission = allowedRoles ? allowedRoles.includes(userRole) : true;
      
      console.log("Checking authorization:", {
        userRole,
        allowedRoles,
        hasPermission
      });
      
      if (!hasPermission) {
        console.log("User role not allowed, redirecting");
        
        if (isMounted) {
          toast.error("Você não tem permissão para acessar esta página");
          
          // Redirect based on role
          switch (userRole) {
            case UserRole.ADMIN:
              navigate("/admin/", { replace: true });
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
      if (checkTimeout !== null) {
        clearTimeout(checkTimeout);
      }
    };
  }, [session, loading, allowedRoles, navigate, initialized]);

  return { isAuthorized, isVerifying };
}
