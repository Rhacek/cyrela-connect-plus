import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import { useNavigate } from "react-router-dom";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/broker/properties/${property.id}`);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  // Função para obter a URL da imagem principal com fallback
  const getMainImageUrl = () => {
    if (property.images && property.images.length > 0) {
      // Tenta encontrar a imagem principal
      const mainImage = property.images.find(img => img.isMain);
      
      // Se encontrou a imagem principal, retorna sua URL
      if (mainImage && mainImage.url) {
        return mainImage.url;
      }
      
      // Caso contrário, retorna a primeira imagem
      if (property.images[0].url) {
        return property.images[0].url;
      }
    }
    
    // Fallback para imagem padrão
    return "https://placehold.co/600x400?text=Imóvel+Cyrela";
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={getMainImageUrl()}
            alt={property.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              // Fallback se a imagem falhar ao carregar
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Imóvel+Cyrela";
            }}
          />
        </AspectRatio>
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
          {formatCurrency(property.price)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{property.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="line-clamp-1">
            {property.neighborhood}, {property.city}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath size={16} className="mr-1" />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square size={16} className="mr-1" />
              <span className="text-sm">{property.area}m²</span>
            </div>
          </div>
        </div>
        <Button onClick={handleViewDetails} className="w-full">
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
