
import { useEffect } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";

const AuthPage = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to appropriate page
    if (session && !loading) {
      console.log("Auth page detected existing session, redirecting");
      
      const userRole = session.user_metadata.role;
      
      if (userRole === UserRole.BROKER) {
        navigate("/broker/dashboard");
      } else if (userRole === UserRole.ADMIN) {
        navigate("/admin");
      } else if (userRole === UserRole.CLIENT) {
        navigate("/client/welcome");
      } else {
        // Fallback for unknown roles
        navigate("/");
      }
    }
  }, [session, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex items-center justify-center p-4">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
