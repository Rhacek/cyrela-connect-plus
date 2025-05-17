
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useLocation } from "react-router-dom";
import { isSessionCacheValid } from "./use-session/cache/session-cache";
import { isClientRoute } from "./use-session/routing/role-redirection";
import { useDebouncedNavigate } from "./use-session/routing/use-debounced-navigate";
import { checkAuthorization } from "./use-session/auth/authorization-checks";

interface SessionVerificationResult {
  isAuthorized: boolean | null;
  isVerifying: boolean;
}

export function useSessionVerification(allowedRoles?: UserRole[]): SessionVerificationResult {
  const { session, loading, initialized } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const debouncedNavigate = useDebouncedNavigate();
  const currentPath = location.pathname;
  
  // Skip verification for client routes - they should remain public
  const isCurrentPathClientRoute = isClientRoute(currentPath);
  
  useEffect(() => {
    // Skip verification for client routes
    if (isCurrentPathClientRoute) {
      setIsAuthorized(true);
      setIsVerifying(false);
      return;
    }
    
    let isMounted = true;
    
    // Check if we can use the cached session first
    if (isSessionCacheValid(location.pathname)) {
      console.log(`Using cached session validation for ${location.pathname}`);
      if (isMounted) {
        setIsAuthorized(true);
        setIsVerifying(false);
      }
      return;
    }
    
    // Add a small timeout to prevent excessive checks during navigation
    const authCheckTimer = setTimeout(() => {
      if (isMounted) {
        // Use the extracted authorization check logic
        checkAuthorization(
          {
            session,
            initialized,
            loading,
            allowedRoles,
            pathname: location.pathname,
            debouncedNavigate,
            isMounted
          },
          {
            setIsAuthorized,
            setIsVerifying
          }
        );
      }
    }, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(authCheckTimer);
    };
  }, [
    session, 
    loading, 
    allowedRoles, 
    initialized, 
    location.pathname, 
    debouncedNavigate,
    isCurrentPathClientRoute
  ]);

  // If this is a client route, always return authorized
  if (isCurrentPathClientRoute) {
    return { isAuthorized: true, isVerifying: false };
  }

  return { isAuthorized, isVerifying };
}
