
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useLocation } from "react-router-dom";
import { isSessionCacheValid, updateSessionCache } from "./use-session/cache/session-cache";
import { isClientRoute } from "./use-session/routing/role-redirection";
import { useDebouncedNavigate } from "./use-session/routing/use-debounced-navigate";
import { checkAuthorization } from "./use-session/auth/authorization-checks";
import { supabase } from "@/lib/supabase";

interface SessionVerificationResult {
  isAuthorized: boolean | null;
  isVerifying: boolean;
}

export function useSessionVerification(allowedRoles?: UserRole[]): SessionVerificationResult {
  const { session, loading, initialized, setSession } = useAuth();
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
    
    // For admin routes, add extra verification
    const isAdminRoute = currentPath.startsWith('/admin');
    
    // Check if we can use the cached session first
    if (isSessionCacheValid(location.pathname)) {
      console.log(`Using cached session validation for ${location.pathname}`);
      if (isMounted) {
        setIsAuthorized(true);
        setIsVerifying(false);
      }
      return;
    }
    
    // Function to verify admin session with Supabase directly
    const verifyAdminSession = async () => {
      if (!session || session.user_metadata?.role !== UserRole.ADMIN) {
        return false;
      }
      
      try {
        // Verify the session is still valid with Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.error("Admin session verification failed:", error);
          return false;
        }
        
        // Ensure the session belongs to an admin
        const userRole = data.session.user.user_metadata?.role;
        return userRole === UserRole.ADMIN;
      } catch (err) {
        console.error("Error verifying admin session:", err);
        return false;
      }
    };
    
    // Add a small timeout to prevent excessive checks during navigation
    const authCheckTimer = setTimeout(async () => {
      if (isMounted) {
        // For admin routes, do additional verification
        if (isAdminRoute && session?.user_metadata?.role === UserRole.ADMIN) {
          const isValidAdminSession = await verifyAdminSession();
          
          if (!isValidAdminSession) {
            console.warn("Admin session verification failed, attempting to refresh session");
            // Try refreshing the session
            const { data, error } = await supabase.auth.refreshSession();
            
            if (error || !data.session) {
              if (isMounted) {
                setIsAuthorized(false);
                setIsVerifying(false);
              }
              return;
            }
            
            // Update the session in auth context
            if (isMounted && data.session) {
              // Use partial type for user metadata since we don't know if all fields exist
              const metadata = data.session.user.user_metadata as Partial<{
                name: string;
                role: UserRole;
                brokerCode?: string;
                brokerage?: string;
                creci?: string;
                company?: string;
                city?: string;
                zone?: string;
                profile_image?: string;
              }>;
              
              // Add validation for required fields
              const name = metadata.name || '';
              const role = metadata.role as UserRole | undefined;
              
              // If role isn't valid, don't update session and treat as unauthorized
              if (!role) {
                console.error("Role missing in user metadata after refresh");
                setIsAuthorized(false);
                setIsVerifying(false);
                return;
              }
              
              setSession({
                id: data.session.user.id,
                email: data.session.user.email || '',
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
                user_metadata: {
                  name,
                  role,
                  brokerCode: metadata.brokerCode,
                  brokerage: metadata.brokerage,
                  creci: metadata.creci,
                  company: metadata.company,
                  city: metadata.city,
                  zone: metadata.zone,
                  profile_image: metadata.profile_image
                }
              });
              
              // Check if the refreshed session has ADMIN role
              if (role === UserRole.ADMIN) {
                setIsAuthorized(true);
                updateSessionCache({
                  id: data.session.user.id,
                  email: data.session.user.email || '',
                  user_metadata: {
                    name,
                    role,
                    brokerCode: metadata.brokerCode,
                    brokerage: metadata.brokerage,
                    creci: metadata.creci,
                    company: metadata.company,
                    city: metadata.city,
                    zone: metadata.zone,
                    profile_image: metadata.profile_image
                  }
                }, currentPath);
              } else {
                setIsAuthorized(false);
              }
              
              setIsVerifying(false);
              return;
            }
          } else if (isMounted) {
            // Admin session is valid
            setIsAuthorized(true);
            updateSessionCache(session, currentPath);
            setIsVerifying(false);
            return;
          }
        }
        
        // Use the extracted authorization check logic for non-admin routes
        // or admin routes that didn't pass the additional verification
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
    isCurrentPathClientRoute,
    setSession
  ]);

  // If this is a client route, always return authorized
  if (isCurrentPathClientRoute) {
    return { isAuthorized: true, isVerifying: false };
  }

  return { isAuthorized, isVerifying };
}
