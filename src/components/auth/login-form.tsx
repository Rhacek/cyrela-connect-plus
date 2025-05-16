
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";

interface LoginFormProps {
  onLoginAttempt: () => void;
}

export function LoginForm({ onLoginAttempt }: LoginFormProps) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      console.log("Attempting login with:", loginEmail);
      
      // Clear any existing session data first
      localStorage.removeItem('sb-cbdytpkwalaoshbvxxri-auth-token');
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      if (error) {
        throw error;
      }
      
      // Additional check - make sure session is stored
      if (data.session) {
        console.log("Login successful, session obtained:", data.session.user.id);
        
        // Explicitly store session in local storage for extra reliability
        localStorage.setItem('sb-cbdytpkwalaoshbvxxri-auth-token', JSON.stringify({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: Math.floor(new Date(data.session.expires_at).getTime() / 1000)
        }));
        
        // Verify the session was stored
        const storedSessionStr = localStorage.getItem('sb-cbdytpkwalaoshbvxxri-auth-token');
        if (storedSessionStr) {
          console.log("Session successfully stored in localStorage");
        } else {
          console.error("Failed to store session in localStorage");
        }
        
        // Update Auth context
        await signIn(loginEmail, loginPassword);
        
        // Immediately verify session was set
        const { data: sessionCheck } = await supabase.auth.getSession();
        if (sessionCheck.session) {
          console.log("Session verified after login:", sessionCheck.session.user.id);
        } else {
          console.warn("Session not found immediately after login, retrying...");
          // Try to refresh the session
          await supabase.auth.refreshSession();
        }
        
        onLoginAttempt(); // Signal to parent that login was attempted
        toast.success("Login bem-sucedido!");
      } else {
        console.error("No session returned after successful login");
        toast.error("Erro no login: Sessão não foi criada");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Falha no login", { 
        description: "Verifique seu email e senha e tente novamente." 
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
