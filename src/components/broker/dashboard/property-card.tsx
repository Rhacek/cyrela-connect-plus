
import { Share, MapPin, Bed, Bath, Square, Car, Check, Construction, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  className?: string;
}

export function PropertyCard({ property, showActions = true, className }: PropertyCardProps) {
  const getConstructionStageColor = (stage?: string) => {
    switch (stage) {
      case "Na planta":
        return "bg-blue-100 text-blue-800";
      case "Em construção":
        return "bg-orange-100 text-orange-800";
      case "Pronto para morar":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConstructionStageIcon = (stage?: string) => {
    switch (stage) {
      case "Na planta":
        return <Building size={14} className="mr-1" />;
      case "Em construção":
        return <Construction size={14} className="mr-1" />;
      case "Pronto para morar":
        return <Check size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-lg overflow-hidden shadow-sm border border-cyrela-gray-lighter hover:shadow-md transition-all duration-200 flex flex-col h-full",
      property.isHighlighted && "border-living-gold",
      className
    )}>
      <div className="relative">
        <img
          src={property.images[0]?.url || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        
        <div className="absolute top-0 left-0 right-0 p-3 flex justify-between">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded font-inter max-w-[120px] truncate flex items-center",
            getConstructionStageColor(property.constructionStage)
          )}>
            {getConstructionStageIcon(property.constructionStage)}
            {property.constructionStage || "Não informado"}
          </span>
          
          {property.isHighlighted && (
            <span className="px-2 py-1 text-xs font-medium rounded bg-living-gold text-white font-inter">
              Destaque
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-semibold text-base line-clamp-1 font-poppins">{property.title}</h3>
          <div className="flex items-center mt-1 text-cyrela-gray-dark text-sm font-inter">
            <MapPin size={16} className="mr-1 shrink-0" />
            <span className="line-clamp-1">
              {property.neighborhood}, {property.city}
            </span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex items-center">
            <span className="text-xs text-cyrela-gray-dark font-inter">Valor</span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-lg font-bold text-primary font-poppins">
              {formatCurrency(property.price)}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs font-inter mt-auto mb-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <Bed size={16} className="text-cyrela-gray-dark" />
            </div>
            <span className="mt-1">{property.bedrooms}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <Bath size={16} className="text-cyrela-gray-dark" />
            </div>
            <span className="mt-1">{property.bathrooms}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <Square size={16} className="text-cyrela-gray-dark" />
            </div>
            <span className="mt-1">{property.area}m²</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center">
              <Car size={16} className="text-cyrela-gray-dark" />
            </div>
            <span className="mt-1">{property.parkingSpaces}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="pt-3 border-t border-cyrela-gray-lighter flex justify-between mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white border-primary text-primary hover:bg-cyrela-gray-lighter font-inter text-xs px-2"
            >
              <Share size={14} className="mr-1 shrink-0" />
              <span className="truncate">Compartilhar</span>
            </Button>
            
            <Button 
              className="bg-primary hover:bg-primary hover:opacity-90 text-white font-inter text-xs" 
              size="sm"
            >
              Ver detalhes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
