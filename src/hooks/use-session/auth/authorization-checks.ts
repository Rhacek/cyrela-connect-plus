
import { UserSession } from '@/types/auth';
import { UserRole } from '@/types';
import { updateSessionCache } from '../cache/session-cache';
import { redirectBasedOnRole, isProtectedRoute } from '../routing/role-redirection';
import { hasRolePermission } from './permission-checks';
import { supabase } from '@/lib/supabase';

/**
 * Primary function to check if a user is authorized for a specific route
 */
export const checkAuthorization = async (
  args: {
    session: UserSession | null;
    initialized: boolean;
    loading: boolean;
    allowedRoles?: UserRole[];
    pathname: string;
    debouncedNavigate: (path: string) => void;
    isMounted: boolean;
  },
  callbacks: {
    setIsAuthorized: (value: boolean) => void;
    setIsVerifying: (value: boolean) => void;
  }
): Promise<void> => {
  const { 
    session, 
    initialized, 
    loading, 
    allowedRoles, 
    pathname, 
    debouncedNavigate,
    isMounted 
  } = args;
  
  const { setIsAuthorized, setIsVerifying } = callbacks;
  
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
    path: pathname
  });
  
  // Special handling for admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute && session) {
    // For admin routes, first verify the stored session is actually valid
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        console.warn("Session verification failed for admin route:", error);
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // Explicit check for admin role
      const userRole = data.session.user.user_metadata?.role;
      
      if (userRole !== UserRole.ADMIN) {
        console.warn("User role is not ADMIN for admin route");
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
        return;
      }
      
      // Admin user is authorized for admin routes
      if (isMounted) {
        console.log("Admin user verified for admin route");
        setIsAuthorized(true);
        setIsVerifying(false);
        
        // Update session cache for admin routes
        updateSessionCache(session, pathname);
      }
      return;
    } catch (err) {
      console.error("Error verifying admin session:", err);
      if (isMounted) {
        setIsAuthorized(false);
        setIsVerifying(false);
      }
      return;
    }
  }
  
  // Standard authorization for non-admin routes follows below
  
  // If we have a session but no allowed roles, it's protected but open to all authenticated
  if (!allowedRoles && session) {
    console.log("Route is protected but open to all authenticated users");
    if (isMounted) {
      setIsAuthorized(true);
      setIsVerifying(false);
    }
    return;
  }
  
  // Determine if this is a protected route
  const isCurrentRouteProtected = isProtectedRoute(pathname);
  
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
    path: pathname
  });
  
  if (!hasPermission) {
    console.log("User role not allowed, redirecting");
    
    if (isMounted) {
      // Handle role-based redirection
      if (session) {
        redirectBasedOnRole(
          session.user_metadata.role, 
          pathname,
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
      
      // Update session cache
      updateSessionCache(session, pathname);
    }
  }
};
