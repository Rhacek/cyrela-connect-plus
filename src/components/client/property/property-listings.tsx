
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/broker/dashboard/property-card";
import { Property } from "@/types";

interface PropertyListingsProps {
  properties: Property[];
}

export function PropertyListings({ properties }: PropertyListingsProps) {
  return (
    <div className="lg:col-span-3">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-cyrela-gray-dark">
          {properties.length} imóveis encontrados
        </h2>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none bg-white text-cyrela-gray-dark border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
          >
            Ordenar por relevância
          </Button>
          
          <Button 
            className="flex-1 md:flex-none bg-cyrela-blue text-white hover:bg-cyrela-blue hover:opacity-90"
          >
            Mapa
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property}
            showActions={true}
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}
