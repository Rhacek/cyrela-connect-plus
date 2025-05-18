
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { transformUserData } from "@/utils/auth-utils";
import { useLocation } from "react-router-dom";

export const useAuthVerification = () => {
  const { session, loading, setSession, initialized } = useAuth();
  const location = useLocation();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  
  // Parse redirect parameter from URL
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');
  
  useEffect(() => {
    // First, verify if we have a local session
    const checkAuth = async () => {
      console.log("AuthPage - Checking authentication:", {
        hasSession: !!session,
        loading,
        initialized,
        redirectPath
      });
      
      if (session && !loading) {
        console.log("AuthPage - Found session in context:", session.id);
        return;
      }
      
      // If auth context is not yet initialized, wait for it
      if (!initialized && loading) {
        console.log("AuthPage - Auth context not yet initialized, waiting...");
        return;
      }
      
      // If no session in context, try checking with Supabase directly
      if (!session && !loading) {
        try {
          console.log("AuthPage - No session in context, checking with Supabase directly");
          
          const lastAuthCheck = sessionStorage.getItem('lastAuthCheck');
          const now = Date.now();
          
          // Only check once per minute to avoid rate limits
          if (lastAuthCheck && now - parseInt(lastAuthCheck) < 60000) {
            console.log("Skipping auth check - performed recently");
            setIsVerifyingAuth(false);
            return;
          }
          
          sessionStorage.setItem('lastAuthCheck', now.toString());
          
          // Check for existing session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error checking Supabase session:", error);
            setIsVerifyingAuth(false);
            return;
          }
          
          if (data.session) {
            console.log("AuthPage - Found session from Supabase:", data.session.user.id);
            
            // Transform user data to our expected format
            const userSession = await transformUserData(data.session.user);
            
            // Update the auth context with the restored session
            setSession(userSession);
            return;
          }
          
          // No session found anywhere
          console.log("AuthPage - No valid session found after all checks");
          setIsVerifyingAuth(false);
        } catch (err) {
          console.error("Unexpected error verifying session:", err);
          setIsVerifyingAuth(false);
        }
      }
    };
    
    checkAuth();
  }, [session, loading, setSession, initialized, redirectPath]);
  
  // Set verification to false once we have a session
  useEffect(() => {
    if (session) {
      setIsVerifyingAuth(false);
    }
  }, [session]);

  return { 
    isVerifyingAuth, 
    redirectPath,
    authState: {
      session,
      loading,
      initialized
    }
  };
};
