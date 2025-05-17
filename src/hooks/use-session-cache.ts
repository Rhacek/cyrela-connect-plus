
import { useState, useEffect } from 'react';
import { 
  isSessionCacheValid, 
  updateSessionCache as updateCache, 
  clearSessionCache, 
  getCachedSession 
} from './use-session/cache/session-cache';

/**
 * Hook to check if we have a cached valid session for the current route
 */
export function useSessionCache(routePath: string) {
  const [hasValidCache, setHasValidCache] = useState<boolean>(false);
  
  useEffect(() => {
    const isValid = isSessionCacheValid(routePath);
    setHasValidCache(isValid);
  }, [routePath]);
  
  return {
    hasValidCache,
    updateSessionCache: updateCache,
    clearSessionCache,
    cachedSession: getCachedSession()
  };
}
