
import { useState, useEffect } from 'react';
import { UserSession } from '@/types/auth';

const SESSION_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CachedSession {
  session: UserSession | null;
  timestamp: number;
  verifiedRoutes: string[];
}

// In-memory cache to avoid repeated verifications
const sessionCache: CachedSession = {
  session: null,
  timestamp: 0,
  verifiedRoutes: []
};

/**
 * Hook to check if we have a cached valid session for the current route
 */
export function useSessionCache(routePath: string) {
  const [hasValidCache, setHasValidCache] = useState<boolean>(false);
  
  useEffect(() => {
    const now = Date.now();
    const isSessionCacheValid = 
      sessionCache.session !== null && 
      (now - sessionCache.timestamp < SESSION_CACHE_DURATION);
    
    const isRouteVerified = sessionCache.verifiedRoutes.includes(routePath);
    
    setHasValidCache(isSessionCacheValid && isRouteVerified);
  }, [routePath]);
  
  // Function to update the cache when a session is successfully verified
  const updateSessionCache = (session: UserSession | null, route: string) => {
    if (session) {
      sessionCache.session = session;
      sessionCache.timestamp = Date.now();
      
      // Add the route to verified routes if not already present
      if (!sessionCache.verifiedRoutes.includes(route)) {
        sessionCache.verifiedRoutes.push(route);
      }
      
      console.log(`Session cache updated for route: ${route}`);
    } else {
      // If session is null, we should clear the cache
      clearSessionCache();
    }
  };
  
  // Function to clear the session cache
  const clearSessionCache = () => {
    sessionCache.session = null;
    sessionCache.timestamp = 0;
    sessionCache.verifiedRoutes = [];
    console.log('Session cache cleared');
  };
  
  return {
    hasValidCache,
    updateSessionCache,
    clearSessionCache,
    cachedSession: sessionCache.session
  };
}
