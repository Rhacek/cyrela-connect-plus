
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export function ShareBrokerLink() {
  const { session } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Get the base URL for the application
  const baseUrl = window.location.origin;
  
  // Create the broker reference link
  const brokerRefLink = `${baseUrl}/client/welcome?ref=${session?.id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(brokerRefLink)
      .then(() => {
        setCopied(true);
        toast.success("Link copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Não foi possível copiar o link");
      });
  };
  
  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Visite minha página de corretor",
        text: "Confira meu perfil e os imóveis disponíveis",
        url: brokerRefLink,
      })
      .catch((error) => {
        console.error("Erro ao compartilhar:", error);
      });
    } else {
      copyToClipboard();
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="h-5 w-5 mr-2" />
          Seu Link Permanente
        </CardTitle>
        <CardDescription>
          Compartilhe este link para que clientes acessem sua página personalizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            value={brokerRefLink} 
            readOnly
            className="font-mono text-sm flex-grow"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyToClipboard}
              aria-label="Copiar link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={shareLink}
              aria-label="Compartilhar link"
            >
              Compartilhar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
