
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { transformUserData } from "@/utils/auth-utils";

interface LoginFormProps {
  onLoginAttempt: () => void;
}

export function LoginForm({ onLoginAttempt }: LoginFormProps) {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Get redirect path from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '';
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log("Attempting login with:", loginEmail);
      
      // Signal that login was attempted
      onLoginAttempt();
      
      // Use the consolidated Supabase client for login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        console.error("Login error:", error);
        toast.error("Falha no login", { 
          description: error.message || "Verifique seu email e senha e tente novamente." 
        });
        return;
      }
      
      if (!data.session) {
        console.warn("No session returned from login");
        toast.warning("Falha no login. Nenhuma sessão retornada.");
        return;
      }
      
      console.log("Login successful, session established:", data.session.user.id);
      
      // Transform user data to our expected format
      const userSession = transformUserData(data.session.user);
      
      // Set the session in auth context
      setSession(userSession);
      
      toast.success("Login realizado com sucesso!");
      
      // Verify the session was set correctly
      console.log("Session after login:", {
        id: userSession.id,
        role: userSession.user_metadata.role
      });
      
      // Handle redirection based on role or redirect parameter
      const userRole = userSession.user_metadata.role;
      
      if (redirectPath) {
        console.log(`Redirecting to specified path: ${redirectPath}`);
        // Only redirect to admin paths if user is admin
        if (redirectPath.startsWith('/admin') && userRole !== UserRole.ADMIN) {
          console.log("Attempt to redirect to admin path, but user is not admin");
          redirectBasedOnRole(userRole);
        } else {
          navigate(redirectPath, { replace: true });
        }
      } else {
        redirectBasedOnRole(userRole);
      }
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Falha no login", { 
        description: error.message || "Verifique seu email e senha e tente novamente." 
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to redirect based on user role
  const redirectBasedOnRole = (userRole: UserRole) => {
    if (userRole === UserRole.ADMIN) {
      console.log("Admin login successful, redirecting to /admin/");
      navigate("/admin/", { replace: true });
    } else if (userRole === UserRole.BROKER) {
      navigate("/broker/dashboard", { replace: true });
    } else {
      navigate("/client/welcome", { replace: true });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          required
          className="cyrela-input"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="font-medium">Senha</Label>
          <a 
            href="#" 
            className="text-xs text-cyrela-red hover:underline font-inter"
          >
            Esqueceu a senha?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          required
          className="cyrela-input"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <Button
        type="submit"
        className="cyrela-button-primary w-full mt-6"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
