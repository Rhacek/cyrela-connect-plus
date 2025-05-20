import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import { Share2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PropertyShareButtonProps {
  property: Property;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function PropertyShareButton({
  property,
  className,
  variant = "outline"
}: PropertyShareButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Gera o link de compartilhamento
  const getShareLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/onboarding?property=${property.id}`;
  };

  const handleCopyLink = () => {
    const link = getShareLink();
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência."
        });
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error("Erro ao copiar link:", err);
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o link.",
          variant: "destructive"
        });
      });
  };

  const handleShare = async () => {
    const shareData = {
      title: `Cyrela+ | ${property.title}`,
      text: `Confira este imóvel: ${property.title} - ${property.neighborhood}, ${property.city}`,
      url: getShareLink()
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Compartilhado com sucesso!",
          description: "O link foi compartilhado."
        });
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
        // Se o usuário cancelar o compartilhamento, não mostra erro
        if (err instanceof Error && err.name !== "AbortError") {
          toast({
            title: "Erro ao compartilhar",
            description: "Não foi possível compartilhar o link.",
            variant: "destructive"
          });
        }
      }
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Button 
        onClick={handleShare} 
        className={className}
        variant={variant}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Compartilhar
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Compartilhar Imóvel</DialogTitle>
            <DialogDescription>
              Compartilhe este imóvel com potenciais clientes. Eles serão direcionados para o processo de onboarding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={getShareLink()}
                className="flex-1"
              />
              <Button onClick={handleCopyLink}>
                {copied ? "Copiado!" : "Copiar"}
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
