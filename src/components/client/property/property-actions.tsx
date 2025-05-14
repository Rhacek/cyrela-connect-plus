import { useState } from "react";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Heart, MessageSquare, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PropertyActionsProps {
  property: Property;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleScheduleVisit = () => {
    navigate(`/client/schedule/${property.id}`);
  };

  const handleContactBroker = () => {
    // For now just show a toast, later we can implement a contact form
    toast.success("Contato iniciado", {
      description: "Um corretor entrará em contato com você em breve."
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos", {
      description: isFavorite 
        ? "O imóvel foi removido da sua lista de favoritos" 
        : "O imóvel foi adicionado à sua lista de favoritos"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel: ${property.title}`,
        url: window.location.href,
      })
      .catch(() => {
        toast.success("Link copiado", {
          description: "O link do imóvel foi copiado para a área de transferência"
        });
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      toast.success("Link copiado", {
        description: "O link do imóvel foi copiado para a área de transferência"
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={handleScheduleVisit}
          >
            <CalendarClock className="mr-2" size={18} />
            Agendar visita
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleContactBroker}
          >
            <MessageSquare className="mr-2" size={18} />
            Falar com corretor
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className={isFavorite ? "bg-pink-50 text-pink-600 border-pink-200" : ""}
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`mr-2 ${isFavorite ? "fill-pink-600 text-pink-600" : ""}`} 
                size={18} 
              />
              {isFavorite ? "Salvo" : "Salvar"}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleShare}
            >
              <Share className="mr-2" size={18} />
              Compartilhar
            </Button>
          </div>
          
          <div className="text-sm text-cyrela-gray-medium mt-4 p-3 bg-cyrela-gray-lightest rounded-md">
            <p className="font-medium text-cyrela-gray-dark mb-1">Corretor Exclusivo</p>
            <p>João Silva</p>
            <p>CRECI 123456</p>
            <p>joao.silva@cyrela.com.br</p>
            <p>(11) 98765-4321</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
