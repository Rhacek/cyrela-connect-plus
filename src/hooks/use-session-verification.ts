
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useLocation } from "react-router-dom";
import { 
  isSessionCacheValid, 
  updateSessionCache,
  getCachedSession
} from "./use-session/cache/session-cache";
import { 
  isProtectedRoute, 
  isClientRoute,
  redirectBasedOnRole
} from "./use-session/routing/role-redirection";
import { useDebouncedNavigate } from "./use-session/routing/use-debounced-navigate";
import { hasRolePermission } from "./use-session/auth/permission-checks";

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
    
    // Main check for authorization with simplified logic
    const checkAuthorization = async () => {
      // If initialized is false, wait for it before proceeding
      if (!initialized) {
        console.log("Auth context not yet initialized, waiting...");
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
        path: location.pathname
      });
      
      // If we have a session but no allowed roles, it's protected but open to all authenticated
      if (!allowedRoles && session) {
        console.log("Route is protected but open to all authenticated users");
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
          
          // Update session cache if on admin route
          if (location.pathname.startsWith('/admin')) {
            updateSessionCache(session, location.pathname);
          }
        }
        return;
      }
      
      // Determine if this is a protected route
      const isCurrentRouteProtected = isProtectedRoute(location.pathname);
      
      // If not a protected route and no roles specified, authorize
      if (!isCurrentRouteProtected && !allowedRoles) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we don't have a session and this is a protected route, not authorized
      if (!session && isCurrentRouteProtected) {
        console.log("No valid session found for protected route");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we don't have a session but there are allowed roles, not authorized
      if (!session && allowedRoles) {
        console.log("No valid session found for role-protected route");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we have a session but there are no allowed roles, and it's not a protected route, authorize
      if (session && !allowedRoles && !isCurrentRouteProtected) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // Check if user has permission based on role
      const hasPermission = hasRolePermission(session, allowedRoles);
      
      console.log("Checking authorization:", {
        userRole: session?.user_metadata?.role,
        allowedRoles,
        hasPermission,
        path: location.pathname
      });
      
      if (!hasPermission) {
        console.log("User role not allowed, redirecting");
        
        if (isMounted) {
          // Handle role-based redirection
          if (session) {
            redirectBasedOnRole(
              session.user_metadata.role, 
              location.pathname,
              debouncedNavigate
            );
          }
          
          setIsAuthorized(false);
          setIsVerifying(false);
        }
      } else {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
          
          // Update session cache for admin routes
          if (location.pathname.startsWith('/admin')) {
            updateSessionCache(session, location.pathname);
          }
        }
      }
    };
    
    // Add a small timeout to prevent excessive checks during navigation
    const authCheckTimer = setTimeout(() => {
      if (isMounted) {
        checkAuthorization();
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
