
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { supabase, forceSessionRestore } from "@/lib/supabase";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);
  
  useEffect(() => {
    // First, verify if we have a local session
    const checkAuth = async () => {
      if (session && !loading) {
        redirectBasedOnRole(session);
        return;
      }
      
      // If no session in context, try checking with Supabase directly
      if (!session && !loading) {
        try {
          console.log("AuthPage checking session with Supabase directly");
          
          // Try to force session restoration
          const forcedSession = await forceSessionRestore();
          if (forcedSession) {
            console.log("AuthPage found forced session:", forcedSession.user.id);
            setTimeout(() => {
              checkAuth(); // Check again after auth context has updated
            }, 500);
            return;
          }
          
          // Standard session check
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error checking session:", error);
            setIsVerifyingAuth(false);
            return;
          }
          
          if (data.session) {
            console.log("AuthPage found session directly from Supabase");
            // Let auth context handle the actual redirect
            // It will pick up the session via onAuthStateChange
            setTimeout(() => {
              checkAuth(); // Check again after auth context has updated
            }, 500);
            return;
          }
          
          // No session found anywhere
          setIsVerifyingAuth(false);
        } catch (err) {
          console.error("Unexpected error verifying session:", err);
          setIsVerifyingAuth(false);
        }
      }
    };
    
    checkAuth();
  }, [session, loading, navigate]);
  
  const redirectBasedOnRole = (userSession: any) => {
    console.log("Auth page detected existing session, redirecting");
    
    const userRole = 'user' in userSession 
      ? userSession.user.user_metadata.role 
      : userSession.user_metadata.role;
    
    if (userRole === UserRole.BROKER) {
      navigate("/broker/dashboard", { replace: true });
    } else if (userRole === UserRole.ADMIN) {
      navigate("/admin", { replace: true });
    } else if (userRole === UserRole.CLIENT) {
      navigate("/client/welcome", { replace: true });
    } else {
      // Fallback for unknown roles
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
