
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactStepProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function ContactStep({ 
  name, 
  email, 
  phone, 
  onNameChange, 
  onEmailChange, 
  onPhoneChange 
}: ContactStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Seu nome completo"
          className="cyrela-input"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="seu@email.com"
          className="cyrela-input"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="(11) 99999-9999"
          className="cyrela-input"
          required
        />
      </div>
    </div>
  );
}
