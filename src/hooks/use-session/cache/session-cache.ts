
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
 * Checks if a cached session is valid for the specified route
 */
export const isSessionCacheValid = (routePath: string): boolean => {
  const now = Date.now();
  const isTimestampValid = 
    sessionCache.session !== null && 
    (now - sessionCache.timestamp < SESSION_CACHE_DURATION);
  
  const isRouteVerified = sessionCache.verifiedRoutes.includes(routePath);
  
  return isTimestampValid && isRouteVerified;
};

/**
 * Updates the session cache with a new session and route
 */
export const updateSessionCache = (session: UserSession | null, route: string): void => {
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

/**
 * Clears the session cache
 */
export const clearSessionCache = (): void => {
  sessionCache.session = null;
  sessionCache.timestamp = 0;
  sessionCache.verifiedRoutes = [];
  console.log('Session cache cleared');
};

/**
 * Gets the current cached session
 */
export const getCachedSession = (): UserSession | null => sessionCache.session;
