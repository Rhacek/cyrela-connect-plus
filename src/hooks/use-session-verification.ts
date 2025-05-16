
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase, verifySession } from "@/lib/supabase";
import { transformUserData } from "@/utils/auth-utils";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SessionVerificationResult {
  isAuthorized: boolean | null;
  isVerifying: boolean;
}

export function useSessionVerification(allowedRoles?: UserRole[]): SessionVerificationResult {
  const { session, loading, setSession, initialized } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let checkTimeout: number | null = null;

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
          
          // Additional validation to ensure session is actually valid
          const isValid = await verifySession(data.session);
          
          if (!isValid) {
            console.warn("Session verification failed");
            return null;
          }
          
          return transformUserData(data.session.user);
        } else {
          console.log("No session found with Supabase direct check");
          return null;
        }
      } catch (err) {
        console.error("Unexpected error verifying session:", err);
        return null;
      }
    };

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
      
      // If no session in context, verify with Supabase directly
      let currentSession = session;
      
      if (!currentSession) {
        console.log("No session in context, verifying with Supabase directly");
        const verifiedSession = await verifySessionWithSupabase();
        currentSession = verifiedSession;
      }
      
      if (!currentSession) {
        console.log("No valid session found after verification");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we have a session but no allowed roles, it's protected but open to all authenticated
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
  }, [session, loading, allowedRoles, navigate, setSession, initialized]);

  return { isAuthorized, isVerifying };
}
