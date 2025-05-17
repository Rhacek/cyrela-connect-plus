
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useSessionCache } from "./use-session-cache";
import { debounce } from "@/lib/utils";

interface SessionVerificationResult {
  isAuthorized: boolean | null;
  isVerifying: boolean;
}

export function useSessionVerification(allowedRoles?: UserRole[]): SessionVerificationResult {
  const { session, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { hasValidCache, cachedSession, updateSessionCache } = useSessionCache(location.pathname);
  const currentPath = location.pathname;
  
  // Skip verification for client routes - they should remain public
  const isClientRoute = currentPath.startsWith('/client');
  
  // Create a debounced navigation function
  const debouncedNavigate = useCallback(
    debounce((path: string) => {
      // Only navigate if we're not already on this path
      if (currentPath !== path) {
        console.log(`Debounced navigate to ${path}`);
        navigate(path, { replace: true });
      } else {
        console.log(`Already at ${path}, skipping navigation`);
      }
    }, 800),
    [navigate, currentPath]
  );

  useEffect(() => {
    // Skip verification for client routes
    if (isClientRoute) {
      setIsAuthorized(true);
      setIsVerifying(false);
      return;
    }
    
    let isMounted = true;
    
    // Check if we can use the cached session first
    if (hasValidCache) {
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
      const isProtectedRoute = location.pathname.startsWith('/broker') || 
                               location.pathname.startsWith('/admin');
      
      // If not a protected route and no roles specified, authorize
      if (!isProtectedRoute && !allowedRoles) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // If we don't have a session and this is a protected route, not authorized
      if (!session && isProtectedRoute) {
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
      if (session && !allowedRoles && !isProtectedRoute) {
        if (isMounted) {
          setIsAuthorized(true);
          setIsVerifying(false);
        }
        return;
      }
      
      // Check if user has permission based on role
      const userRole = session!.user_metadata.role;
      const hasPermission = allowedRoles ? allowedRoles.includes(userRole) : true;
      
      console.log("Checking authorization:", {
        userRole,
        allowedRoles,
        hasPermission,
        path: location.pathname
      });
      
      if (!hasPermission) {
        console.log("User role not allowed, redirecting");
        
        if (isMounted) {
          toast.error("Você não tem permissão para acessar esta página");
          
          // Redirect based on role using debounced navigation - BUT ONLY REDIRECT FROM ROOT PATHS
          switch (userRole) {
            case UserRole.ADMIN:
              // Only redirect if at root admin path
              if (location.pathname === "/admin") {
                debouncedNavigate("/admin/");
              }
              break;
            case UserRole.BROKER:
              // Only redirect if at root broker path
              if (location.pathname === "/broker") {
                debouncedNavigate("/broker/dashboard");
              }
              break;
            case UserRole.CLIENT:
              // Only redirect if at root client path
              if (location.pathname === "/client") {
                debouncedNavigate("/client/welcome");
              }
              break;
            default:
              // Only redirect if not already on auth
              if (location.pathname !== "/auth") {
                debouncedNavigate("/auth");
              }
              break;
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
    navigate, 
    initialized, 
    location.pathname, 
    hasValidCache, 
    cachedSession, 
    updateSessionCache,
    debouncedNavigate,
    isClientRoute
  ]);

  // If this is a client route, always return authorized
  if (isClientRoute) {
    return { isAuthorized: true, isVerifying: false };
  }

  return { isAuthorized, isVerifying };
}
