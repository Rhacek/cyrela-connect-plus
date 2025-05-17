
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useLocation } from 'react-router-dom';
import { useSessionRedirect, validateSession } from './use-session/session-verification';

/**
 * Hook to periodically check if the session is still valid
 * Helps prevent users from continuing to use the app with an invalid session
 */
export function usePeriodicSessionCheck(isAuthorized: boolean | null, currentPath: string) {
  const [isChecking, setIsChecking] = useState(false);
  const { session, setSession } = useAuth();
  const location = useLocation();
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const debouncedRedirect = useSessionRedirect();
  
  // Skip checks for client routes - they should remain public
  const isClientRoute = currentPath.startsWith('/client');
  if (isClientRoute) {
    return; // Exit early for client routes
  }

  // Function to check session
  const checkSession = async () => {
    if (!isMountedRef.current || isChecking) return;
    
    // Skip for client routes
    if (currentPath.startsWith('/client')) {
      return;
    }
    
    setIsChecking(true);
    
    try {
      console.log('Periodic session check for route:', currentPath);
      await validateSession(session, setSession, currentPath, debouncedRedirect);
    } finally {
      if (isMountedRef.current) {
        setIsChecking(false);
      }
    }
  };

  useEffect(() => {
    // Skip for client routes
    if (currentPath.startsWith('/client')) {
      return;
    }
    
    // Skip if not authorized or already checking
    if (!isAuthorized) {
      return;
    }
    
    // Skip for auth pages
    if (currentPath.startsWith('/auth')) {
      return;
    }
    
    isMountedRef.current = true;
    
    // Initialize a session check that runs periodically
    const initializePeriodicCheck = () => {
      console.log('Setting up periodic session checks for route:', currentPath);
      
      // Check immediately on first render to ensure session hasn't expired before
      // the first interval check is triggered
      checkSession();
      
      // Clear any existing interval to prevent multiple intervals
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      
      // Set up periodic check - every 4 minutes
      checkIntervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          checkSession();
        }
      }, 4 * 60 * 1000); // 4 minutes to prevent token expiry
    };
    
    // Initialize the periodic check
    initializePeriodicCheck();
    
    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [
    isAuthorized,
    currentPath,
    session,
    setSession,
    debouncedRedirect
  ]);
  
  // No need to return anything as this hook is for side effects only
}
