
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/broker/dashboard/property-card";
import { Property } from "@/types";

interface PropertyListingsProps {
  properties: Property[];
  linkPrefix?: string;
}

export function PropertyListings({ properties, linkPrefix = "/broker/properties" }: PropertyListingsProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <h2 className="text-xl font-semibold text-cyrela-gray-dark">
          {properties.length} imóveis encontrados
        </h2>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="w-full md:w-auto bg-white text-cyrela-gray-dark border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
          >
            Ordenar por relevância
          </Button>
        </div>
      </div>
      
      {/* Grid layout with optimized spacing and column count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 w-full">
        {properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property}
            showActions={true}
            className="h-full w-full"
            linkPrefix={linkPrefix}
          />
        ))}
      </div>
    </div>
  );
}
