
import { useState, useEffect } from "react";
import { AppLogo } from "@/components/ui/app-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const { session, setSession } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  // Perform a direct session check to ensure we're not missing a valid session
  useEffect(() => {
    const checkSessionDirectly = async () => {
      if (!session) {
        console.log("Auth form directly checking for session");
        const { data, error } = await supabase.auth.getSession();
        
        if (!error && data.session) {
          console.log("Auth form found session directly:", data.session.user.id);
          
          // Update the auth context with the session
          setSession({
            id: data.session.user.id,
            email: data.session.user.email || '',
            user_metadata: data.session.user.user_metadata
          });
        }
      }
    };
    
    checkSessionDirectly();
  }, [session, setSession]);
  
  // Redirect if session exists (user is already logged in)
  useEffect(() => {
    if (session) {
      console.log("Auth form detected existing session:", session.id);
      
      // Check user role and redirect appropriately
      const userRole = session.user_metadata.role;
      let redirectPath = '/';
      
      if (userRole === UserRole.BROKER) {
        redirectPath = '/broker/dashboard';
      } else if (userRole === UserRole.ADMIN) {
        redirectPath = '/admin/'; // Always use trailing slash for admin
      } else if (userRole === UserRole.CLIENT) {
        redirectPath = '/client/welcome';
      }
      
      console.log(`Redirecting to ${redirectPath} based on role ${userRole}`);
      navigate(redirectPath, { replace: true });
    }
  }, [session, navigate]);

  const handleSuccessfulLogin = () => {
    setLoginAttempted(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
  };

  const handleSuccessfulRegister = () => {
    setActiveTab("login");
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-sm animate-fade-in">
      <AppLogo size="lg" />
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-cyrela-red font-poppins">
          Bem-vindo ao Cyrela Connect+
        </h1>
        <p className="text-cyrela-gray-dark mt-2 font-inter">
          A plataforma que conecta corretores e clientes
        </p>
      </div>

      <div className="w-full cyrela-card">
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onLoginAttempt={handleSuccessfulLogin} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSuccessfulRegister={handleSuccessfulRegister} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
