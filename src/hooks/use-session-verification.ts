
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useLocation } from "react-router-dom";
import { isSessionCacheValid, updateSessionCache } from "./use-session/cache/session-cache";
import { isClientRoute } from "./use-session/routing/role-redirection";
import { useDebouncedNavigate } from "./use-session/routing/use-debounced-navigate";
import { checkAuthorization } from "./use-session/auth/authorization-checks";
import { supabase } from "@/lib/supabase";
import { brokerProfileService } from "@/services/broker-profile.service";

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
    let verificationTimeout: NodeJS.Timeout;
    
    console.log("Starting session verification with state:", {
      sessionExists: !!session,
      userId: session?.id,
      loading,
      initialized,
      currentPath
    });
    
    // Check if we can use the cached session first
    if (isSessionCacheValid(location.pathname)) {
      console.log(`Using cached session validation for ${location.pathname}`);
      if (isMounted) {
        setIsAuthorized(true);
        setIsVerifying(false);
      }
      return;
    }
    
    // Enhanced verification function that looks at both the session metadata AND the profiles table
    const verifyUserAuthorization = async () => {
      try {
        // If no session, then definitely not authorized
        if (!session || !session.id) {
          console.log("No valid session found during verification");
          return false;
        }
        
        // First check user_metadata role if available
        const metadataRole = session.user_metadata?.role;
        
        // For admin routes, we need special verification
        const isAdminRoute = currentPath.startsWith('/admin');
        const isBrokerRoute = currentPath.startsWith('/broker');
        
        // If we have role in metadata and it matches the route type, quick approve
        if (metadataRole) {
          if ((isAdminRoute && metadataRole === UserRole.ADMIN) || 
              (isBrokerRoute && metadataRole === UserRole.BROKER)) {
            return true;
          }
        }
        
        // If no metadata role or it doesn't match, check profiles table as backup
        // Use the profile service to get the accurate role information
        const profile = await brokerProfileService.getPublicProfile(session.id);
        
        if (!profile) {
          console.warn("No profile found for user in profiles table:", session.id);
          return false;
        }
        
        console.log("Profile found in database:", {
          userId: profile.id,
          role: profile.role || "not set" 
        });
        
        // Now check if the profile role matches the required role
        if (isAdminRoute && profile.role === UserRole.ADMIN) {
          return true;
        }
        
        if (isBrokerRoute && profile.role === UserRole.BROKER) {
          return true;
        }
        
        // If no specific role is required, authorize any authenticated user with a profile
        if (!allowedRoles || allowedRoles.length === 0) {
          return true;
        }
        
        // Check if profile role is in allowed roles
        if (profile.role && allowedRoles.includes(profile.role)) {
          return true;
        }
        
        return false;
      } catch (err) {
        console.error("Error verifying user authorization:", err);
        return false;
      }
    };
    
    // Actual auth check with a short delay to avoid race conditions
    const performAuthCheck = async () => {
      if (!isMounted) return;
      
      // Don't attempt verification if session is still loading or not initialized
      if (loading || !initialized) {
        console.log("Auth not ready yet, delaying verification");
        verificationTimeout = setTimeout(performAuthCheck, 500);
        return;
      }
      
      console.log("Performing auth check with state:", {
        sessionExists: !!session,
        userId: session?.id,
        loading,
        initialized,
        currentPath
      });
      
      try {
        // Try to directly verify if user is authorized
        const isUserAuthorized = await verifyUserAuthorization();
        
        if (isUserAuthorized) {
          console.log("User authorized based on verification");
          if (isMounted) {
            setIsAuthorized(true);
            setIsVerifying(false);
            
            // Update session cache with successful verification
            if (session) {
              updateSessionCache(session, currentPath);
            }
          }
          return;
        }
        
        // If not directly authorized, use the standard authorization check
        if (isMounted) {
          // Use the extracted authorization check logic as fallback
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
      } catch (error) {
        console.error("Error in performAuthCheck:", error);
        if (isMounted) {
          setIsAuthorized(false);
          setIsVerifying(false);
        }
      }
    };
    
    // Add a short delay to prevent excessive checks during navigation
    // and to allow session initialization to complete
    verificationTimeout = setTimeout(performAuthCheck, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(verificationTimeout);
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
