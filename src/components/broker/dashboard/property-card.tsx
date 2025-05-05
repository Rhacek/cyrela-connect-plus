
import { Share, Building, MapPin, Bed, Bath, Square, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property, PropertyStatus } from "@/types";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  className?: string;
}

export function PropertyCard({ property, showActions = true, className }: PropertyCardProps) {
  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return "bg-green-100 text-green-800";
      case PropertyStatus.RESERVED:
        return "bg-yellow-100 text-yellow-800";
      case PropertyStatus.SOLD:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.AVAILABLE:
        return "Disponível";
      case PropertyStatus.RESERVED:
        return "Reservado";
      case PropertyStatus.SOLD:
        return "Vendido";
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-lg overflow-hidden shadow-sm border border-cyrela-gray-lighter hover:shadow-md transition-all duration-200",
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
            "px-2 py-1 text-xs font-medium rounded font-inter",
            getStatusColor(property.status)
          )}>
            {getStatusLabel(property.status)}
          </span>
          
          {property.isHighlighted && (
            <span className="px-2 py-1 text-xs font-medium rounded bg-living-gold text-white font-inter">
              Destaque
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 font-poppins">{property.title}</h3>
          <div className="flex items-center mt-1 text-cyrela-gray-dark text-sm font-inter">
            <MapPin size={16} className="mr-1" />
            <span className="line-clamp-1">
              {property.neighborhood}, {property.city}
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-cyrela-gray-dark font-inter">Valor</span>
            <span className="text-xs text-cyrela-gray-dark font-inter">Tipo</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-lg font-bold text-primary font-poppins">
              {formatCurrency(property.price)}
            </span>
            <div className="flex items-center font-inter">
              <Building size={16} className="mr-1 text-cyrela-gray-dark" />
              <span className="text-sm">{property.type}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-sm font-inter">
          <div className="flex items-center">
            <Bed size={16} className="mr-1 text-cyrela-gray-dark" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
          </div>
          
          <div className="flex items-center">
            <Bath size={16} className="mr-1 text-cyrela-gray-dark" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'banho' : 'banhos'}</span>
          </div>
          
          <div className="flex items-center">
            <Square size={16} className="mr-1 text-cyrela-gray-dark" />
            <span>{property.area}m²</span>
          </div>
          
          <div className="flex items-center">
            <Car size={16} className="mr-1 text-cyrela-gray-dark" />
            <span>{property.parkingSpaces}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-4 pt-3 border-t border-cyrela-gray-lighter flex justify-between">
            <Button variant="outline" size="sm" className="bg-white border-primary text-primary hover:bg-cyrela-gray-lighter font-inter">
              <Share size={16} className="mr-2" />
              Compartilhar
            </Button>
            
            <Button className="bg-primary hover:bg-primary hover:opacity-90 text-white font-inter" size="sm">
              Ver detalhes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
