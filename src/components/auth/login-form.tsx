
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { transformUserData } from "@/utils/auth-utils";

interface LoginFormProps {
  onLoginAttempt: () => void;
}

export function LoginForm({ onLoginAttempt }: LoginFormProps) {
  const { setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log("Attempting login with:", loginEmail);
      
      // Signal that login was attempted
      onLoginAttempt();
      
      // Use direct Supabase login for more reliable session handling
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
      
      // Ensure we wait for the session to be fully established
      setTimeout(async () => {
        try {
          // Verify session is actually persisted
          const { data: sessionCheck } = await supabase.auth.getSession();
          
          if (sessionCheck.session) {
            console.log("Session confirmed after login:", sessionCheck.session.user.id);
            
            // Transform user data to our expected format
            const userSession = transformUserData(sessionCheck.session.user);
            
            // Explicitly set the session in auth context
            setSession(userSession);
            
            toast.success("Login realizado com sucesso!");
          } else {
            console.warn("Session not found after successful login and timeout");
            
            // Try one more time with a direct session from the login response
            const userSession = transformUserData(data.session.user);
            setSession(userSession);
            
            toast.success("Login realizado com sucesso!");
          }
        } catch (verifyError) {
          console.error("Error verifying session after login:", verifyError);
          toast.error("Erro ao verificar sessão após login");
        }
      }, 500); // Small delay to ensure session is established
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Falha no login", { 
        description: error.message || "Verifique seu email e senha e tente novamente." 
      });
    } finally {
      setLoading(false);
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
