import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLogo } from "@/components/ui/app-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const { signIn, signUp, loading, session } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const location = useLocation();
  const [processingAuth, setProcessingAuth] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerBrokerCode, setRegisterBrokerCode] = useState("");

  // Redirect if session exists (user is already logged in)
  useEffect(() => {
    if (session && loginAttempted) {
      console.log("Auth form detected existing session after login attempt:", session.id);
      
      // Check user role and redirect appropriately
      const userRole = session.user_metadata.role;
      let redirectPath = '/';
      
      if (userRole === 'BROKER') {
        redirectPath = '/broker/dashboard';
      } else if (userRole === 'ADMIN') {
        redirectPath = '/admin';
      } else if (userRole === 'CLIENT') {
        redirectPath = '/client/welcome';
      }
      
      console.log(`Redirecting to ${redirectPath} based on role ${userRole}`);
      navigate(redirectPath, { replace: true });
    }
  }, [session, navigate, loginAttempted]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setProcessingAuth(true);
      console.log("Attempting login with:", loginEmail);
      
      await signIn(loginEmail, loginPassword);
      setLoginAttempted(true);
      
      // Verify session directly
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Login successful, session verified:", data.session.user.id);
      }
      
      // The redirect is handled by the useEffect that watches the session
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Falha no login", { 
        description: "Verifique seu email e senha e tente novamente." 
      });
    } finally {
      setProcessingAuth(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setProcessingAuth(true);
      await signUp(registerEmail, registerPassword, registerName, registerBrokerCode);
      setActiveTab("login");
      toast.success("Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar sua conta.");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Falha no cadastro", {
        description: "Verifique seus dados e tente novamente."
      });
    } finally {
      setProcessingAuth(false);
    }
  };

  // Show loading state if we are processing auth or if auth is loading
  const isLoading = loading || processingAuth;

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
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="cyrela-button-primary w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="font-medium">Nome completo</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Seu nome completo"
                  required
                  className="cyrela-input"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="font-medium">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="cyrela-input"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone" className="font-medium">Telefone</Label>
                <Input
                  id="register-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  required
                  className="cyrela-input"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="font-medium">Senha</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="cyrela-input"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-broker-code" className="font-medium">Código de corretor (opcional)</Label>
                <Input
                  id="register-broker-code"
                  type="text"
                  placeholder="CRECI ou código interno"
                  className="cyrela-input"
                  value={registerBrokerCode}
                  onChange={(e) => setRegisterBrokerCode(e.target.value)}
                />
                <p className="text-xs text-cyrela-gray-dark font-inter">
                  Se você é corretor, informe seu CRECI ou código interno Cyrela
                </p>
              </div>
              
              <Button
                type="submit"
                className="cyrela-button-primary w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
