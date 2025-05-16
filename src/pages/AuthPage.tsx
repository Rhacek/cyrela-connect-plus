
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { supabase, forceSessionRestore } from "@/lib/supabase";
import { transformUserData } from "@/utils/auth-utils";

const AuthPage = () => {
  const { session, loading, setSession, initialized } = useAuth();
  const navigate = useNavigate();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  
  useEffect(() => {
    // First, verify if we have a local session
    const checkAuth = async () => {
      console.log("AuthPage - Checking authentication. Session exists:", !!session, "Loading:", loading, "Initialized:", initialized);
      
      if (session && !loading) {
        console.log("AuthPage - Found session in context:", session.id);
        redirectBasedOnRole(session);
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
          
          // Try to force session restoration
          const forcedSession = await forceSessionRestore();
          if (forcedSession) {
            console.log("AuthPage - Found forced session:", forcedSession.user.id);
            
            // Transform user data to our expected format
            const userSession = transformUserData(forcedSession.user);
            
            // Update the auth context with the restored session
            setSession(userSession);
            
            // Use the session directly instead of waiting for context update
            redirectBasedOnRole(userSession);
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
  }, [session, loading, navigate, setSession, initialized]);
  
  // Separate useEffect to prevent redirection race conditions
  useEffect(() => {
    // If session changes, check for redirection
    if (session) {
      redirectBasedOnRole(session);
    }
  }, [session, navigate]);
  
  const redirectBasedOnRole = (userSession: any) => {
    console.log("Auth page detected existing session, redirecting based on role");
    
    // Get the role from the user_metadata
    const userRole = userSession.user_metadata.role;
    
    console.log("User role detected:", userRole);
    
    if (userRole === UserRole.BROKER) {
      console.log("Redirecting to broker dashboard");
      navigate("/broker/dashboard", { replace: true });
    } else if (userRole === UserRole.ADMIN) {
      // Always redirect admins to /admin/ with trailing slash
      console.log("Redirecting to admin dashboard with trailing slash");
      navigate("/admin/", { replace: true });
    } else if (userRole === UserRole.CLIENT) {
      console.log("Redirecting to client welcome page");
      navigate("/client/welcome", { replace: true });
    } else {
      // Fallback for unknown roles
      console.log("Unknown role, redirecting to home page");
      navigate("/", { replace: true });
    }
  };
  
  // Show loading while verifying auth
  if (loading || isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-cyrela-gray-lightest flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrela-red"></div>
          <p className="text-cyrela-gray-dark">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
