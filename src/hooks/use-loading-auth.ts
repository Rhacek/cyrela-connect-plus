
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export function useLoadingAuth() {
  const { loading: authLoading, session } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      // Add a slight delay to ensure the UI doesn't flash
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  return {
    isReady,
    isAuthenticated: !!session,
    session,
  };
}
