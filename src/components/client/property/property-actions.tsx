import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import { Phone, MessageSquare, Share, Calendar } from "lucide-react";
import { ScheduleVisitButton } from "./schedule-visit-button";
import { useNavigate } from "react-router-dom";
import { propertiesService } from "@/services/properties.service";

interface PropertyActionsProps {
  property: Property;
  brokerId?: string | null;
}

export function PropertyActions({ property, brokerId }: PropertyActionsProps) {
  const navigate = useNavigate();
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };
  
  const handleShare = async () => {
    // Open sharing options or copy link
    setIsSharingOpen(true);
    
    try {
      // Increment share count
      await propertiesService.incrementShares(property.id);
      
      // For simplicity, we'll just copy the URL to clipboard
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      alert("Link copiado para área de transferência!");
    } catch (err) {
      console.error('Error sharing property: ', err);
    } finally {
      setIsSharingOpen(false);
    }
  };

  const handleContactBroker = () => {
    if (brokerId) {
      // If we have a broker ID, use WhatsApp
      const phone = "5511987654321"; // This would come from the broker profile in a real app
      const message = `Olá, estou interessado no imóvel ${property.title} (${property.id}) e gostaria de mais informações.`;
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      // Otherwise navigate to onboarding to get a broker
      navigate('/client/onboarding');
    }
  };
  
  return (
    <Card className="sticky top-4">
      <CardContent className="p-5 space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(property.price)}
          </div>
          {property.promotionalPrice && property.promotionalPrice < property.price && (
            <div className="text-sm line-through text-cyrela-gray-medium">
              {formatCurrency(property.price)}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <ScheduleVisitButton propertyId={property.id} brokerId={brokerId} />
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleContactBroker}
          >
            {brokerId ? (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Falar com seu corretor
              </>
            ) : (
              <>
                <Phone className="mr-2 h-4 w-4" />
                Falar com um corretor
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={handleShare}
          >
            <Share className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">Informações sobre o imóvel</h3>
          <ul className="text-sm space-y-1 text-cyrela-gray-dark">
            {property.type && <li>Tipo: {property.type}</li>}
            <li>Área: {property.area} m²</li>
            <li>{property.bedrooms} quartos • {property.bathrooms} banheiros</li>
            {property.parkingSpaces > 0 && (
              <li>{property.parkingSpaces} {property.parkingSpaces === 1 ? 'vaga' : 'vagas'} de garagem</li>
            )}
            {property.constructionStage && (
              <li>Estágio: {property.constructionStage}</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
