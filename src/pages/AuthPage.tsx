
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { useNavigate } from "react-router-dom";
import { AuthLoading } from "@/components/auth/auth-loading";
import { useAuthVerification } from "@/hooks/use-auth-verification";
import { redirectBasedOnRole } from "@/utils/auth-redirect-utils";

const AuthPage = () => {
  const navigate = useNavigate();
  const { isVerifyingAuth, redirectPath, authState } = useAuthVerification();
  const { session } = authState;
  
  // Handle redirections based on session
  useEffect(() => {
    if (session) {
      redirectBasedOnRole(session, redirectPath, navigate, location.pathname);
    }
  }, [session, navigate, redirectPath]);
  
  // Show loading while verifying auth
  if (isVerifyingAuth) {
    return <AuthLoading />;
  }
  
  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
