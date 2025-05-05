
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLogo } from "@/components/ui/app-logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UserRole } from "@/types";

export function AuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock login success
      setTimeout(() => {
        toast.success("Login realizado com sucesso!");
        window.location.href = "/broker/dashboard";
      }, 1500);
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock registration success
      setTimeout(() => {
        toast.success("Cadastro realizado com sucesso!");
        setActiveTab("login");
      }, 1500);
    } catch (error) {
      toast.error("Erro ao realizar cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-sm">
      <AppLogo size="lg" />
      
      <div className="text-center">
        <h1 className="text-2xl font-bold text-cyrela-blue">
          Bem-vindo ao Cyrela Connect+
        </h1>
        <p className="text-cyrela-gray-dark mt-2">
          A plataforma que conecta corretores e clientes
        </p>
      </div>

      <Tabs 
        defaultValue="login" 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "login" | "register")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Cadastro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="cyrela-input"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a 
                  href="#" 
                  className="text-xs text-cyrela-blue hover:underline"
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
              />
            </div>
            
            <Button
              type="submit"
              className="cyrela-button-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="register">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Nome completo</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Seu nome completo"
                required
                className="cyrela-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="seu@email.com"
                required
                className="cyrela-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-phone">Telefone</Label>
              <Input
                id="register-phone"
                type="tel"
                placeholder="(11) 99999-9999"
                required
                className="cyrela-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">Senha</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                required
                className="cyrela-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-broker-code">Código de corretor (opcional)</Label>
              <Input
                id="register-broker-code"
                type="text"
                placeholder="CRECI ou código interno"
                className="cyrela-input"
              />
              <p className="text-xs text-cyrela-gray-dark">
                Se você é corretor, informe seu CRECI ou código interno Cyrela
              </p>
            </div>
            
            <Button
              type="submit"
              className="cyrela-button-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
