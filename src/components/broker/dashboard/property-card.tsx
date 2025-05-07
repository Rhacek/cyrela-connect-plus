
import { MapPin, Bed, Bath, Square, Car, Check, Construction, Building, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  className?: string;
}

export function PropertyCard({ property, showActions = true, className }: PropertyCardProps) {
  const getConstructionStageColor = (stage?: string) => {
    // Use white background with black text for all stages
    return "bg-white text-black";
  };

  const getConstructionStageIcon = (stage?: string) => {
    switch (stage) {
      case "Na planta":
        return <Building size={14} className="mr-1 text-black" />;
      case "Em construção":
        return <Construction size={14} className="mr-1 text-black" />;
      case "Pronto para morar":
        return <Check size={14} className="mr-1 text-black" />;
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

  // Simulating delivery date (in a real app this would come from the API)
  const getDeliveryDate = () => {
    if (property.constructionStage === "Pronto para morar") {
      return "Pronto";
    } else if (property.constructionStage === "Em construção") {
      return "Dez 2025";
    } else {
      return "Jun 2027";
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full",
      className
    )}>
      <div className="relative">
        <img
          src={property.images[0]?.url || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 sm:h-56 object-cover"
        />
        
        {/* Construction Stage Badge in top-left */}
        <div className="absolute top-0 left-0 p-2 sm:p-3 flex flex-col gap-1.5">
          {/* Dark translucent background for badges */}
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 rounded-lg z-0"></div>
          
          {/* Construction Stage Badge */}
          <Badge className={cn(
            "px-2.5 py-1 text-xs font-medium rounded-md flex items-center z-10 relative",
            getConstructionStageColor(property.constructionStage)
          )}>
            {getConstructionStageIcon(property.constructionStage)}
            {property.constructionStage || "Não informado"}
          </Badge>
        </div>
        
        {/* Star icon for highlighted properties in top-right */}
        {property.isHighlighted && (
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-black bg-opacity-40 rounded-full p-1.5 flex items-center justify-center w-8 h-8">
              <Star 
                size={20} 
                className="text-white fill-white animate-pulse"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-semibold text-base sm:text-lg line-clamp-1 font-poppins">{property.title}</h3>
          <div className="flex items-center mt-1 text-cyrela-gray-dark text-xs sm:text-sm font-inter">
            <MapPin size={14} className="mr-1 shrink-0" />
            <span className="line-clamp-1">
              {property.neighborhood}, {property.city}
            </span>
          </div>
          <div className="text-xs text-cyrela-gray-medium mt-1">
            Entrega: {getDeliveryDate()}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-cyrela-gray-dark mb-3">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <Square size={14} className="mr-1" />
              <span>{property.area}m²</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 mx-2 bg-cyrela-gray-lighter" />
            
            <div className="flex items-center mr-3">
              <Bed size={14} className="mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            
            <Separator orientation="vertical" className="h-4 mx-2 bg-cyrela-gray-lighter" />
            
            <div className="flex items-center">
              <Bath size={14} className="mr-1" />
              <span>{property.bathrooms}</span>
            </div>
          </div>
        </div>
        
        <Separator className="bg-cyrela-gray-lighter mb-3" />
        
        <div className="mb-4">
          <span className="text-xs text-cyrela-gray-medium">A partir de:</span>
          <div className="flex items-center mt-0.5">
            <span className="text-lg sm:text-xl font-bold text-primary font-poppins">
              {formatCurrency(property.price)}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-auto">
            <Button 
              className="w-full bg-primary hover:bg-primary hover:opacity-90 text-white font-inter text-sm py-2 h-10 flex items-center justify-center" 
            >
              Agendar visita
              <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
