
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

interface RegisterFormProps {
  onSuccessfulRegister?: () => void;
}

export function RegisterForm({ onSuccessfulRegister }: RegisterFormProps) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerBrokerCode, setRegisterBrokerCode] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await signUp(registerEmail, registerPassword, registerName, registerBrokerCode);
      toast.success("Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar sua conta.");
      
      // Switch to login tab after successful registration
      if (onSuccessfulRegister) {
        onSuccessfulRegister();
      }
      
      // Reset form fields
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPhone("");
      setRegisterPassword("");
      setRegisterBrokerCode("");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Falha no cadastro", {
        description: "Verifique seus dados e tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
        />
        <p className="text-xs text-cyrela-gray-dark font-inter">
          Se você é corretor, informe seu CRECI ou código interno Cyrela
        </p>
      </div>
      
      <Button
        type="submit"
        className="cyrela-button-primary w-full mt-6"
        disabled={loading}
      >
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
