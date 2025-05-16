
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
      
      // Limpar qualquer sessão antiga que possa estar em um estado inconsistente
      localStorage.removeItem('supabase.auth.token');
      
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
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: data.session,
          expiresAt: Math.floor(Date.now() / 1000) + data.session.expires_in
        }));
        
        // Verifique se a sessão foi realmente armazenada
        const storedSessionStr = localStorage.getItem('supabase.auth.token');
        if (storedSessionStr) {
          console.log("Session successfully stored in localStorage");
        } else {
          console.error("Failed to store session in localStorage");
        }
        
        await signIn(loginEmail, loginPassword);
        onLoginAttempt(); // Signal to parent that login was attempted
        toast.success("Login bem-sucedido!");
      }
      
      // Verify session directly
      const sessionCheck = await supabase.auth.getSession();
      console.log("Session verification after login:", sessionCheck.data.session ? "Session found" : "No session");
      
      // Force a token refresh to ensure it's valid
      if (sessionCheck.data.session) {
        const { data: refreshData } = await supabase.auth.refreshSession();
        if (refreshData.session) {
          console.log("Session refreshed successfully");
        }
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
