
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/context/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { transformUserData } from "@/utils/auth-utils";

const AuthPage = () => {
  const { session, loading, setSession, initialized } = useAuth();
  const navigate = useNavigate();
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
        redirectBasedOnRole(session, redirectPath);
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
            const userSession = transformUserData(data.session.user);
            
            // Update the auth context with the restored session
            setSession(userSession);
            
            // Use the session directly instead of waiting for context update
            redirectBasedOnRole(userSession, redirectPath);
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
  }, [session, loading, navigate, setSession, initialized, redirectPath]);
  
  // Separate useEffect to prevent redirection race conditions
  useEffect(() => {
    // If session changes, check for redirection
    if (session) {
      redirectBasedOnRole(session, redirectPath);
    }
  }, [session, navigate, redirectPath]);
  
  const redirectBasedOnRole = (userSession: any, redirectPath: string | null) => {
    console.log("Auth page detected existing session, redirecting based on role");
    
    // Get the role from the user_metadata
    const userRole = userSession.user_metadata.role;
    
    console.log("User role detected:", userRole);
    
    // If there's a specific redirect path, use it unless it's admin path with wrong role
    if (redirectPath) {
      // Only redirect to admin paths if user is admin
      if (redirectPath.startsWith('/admin') && userRole !== UserRole.ADMIN) {
        console.log("Attempt to redirect to admin path, but user is not admin");
        redirectToDefaultForRole(userRole);
        return;
      }
      
      // Avoid redirecting to the current path
      if (location.pathname !== redirectPath) {
        console.log(`Redirecting to specified path: ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      } else {
        console.log(`Already at specified path: ${redirectPath}, skipping redirect`);
      }
      return;
    }
    
    // Otherwise redirect to role-specific default page
    redirectToDefaultForRole(userRole);
  };
  
  const redirectToDefaultForRole = (userRole: UserRole) => {
    // Avoid redirecting if already at the target route
    if (userRole === UserRole.BROKER && location.pathname === "/broker/dashboard") {
      console.log("Already at broker dashboard, skipping redirect");
      return;
    }
    
    if (userRole === UserRole.ADMIN && location.pathname === "/admin/") {
      console.log("Already at admin dashboard, skipping redirect");
      return;
    }
    
    if (userRole === UserRole.CLIENT && location.pathname === "/client/welcome") {
      console.log("Already at client welcome page, skipping redirect");
      return;
    }
    
    // Proceed with redirection if needed
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
