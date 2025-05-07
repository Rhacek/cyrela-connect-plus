import { FilterButton } from "./filter-button";
import { cities, zones, zoneNeighborhoods } from "./filter-data";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface LocationFilterProps {
  selectedFilters: {
    city: string[];
    zone: string[];
    neighborhood: string[];
  };
  selectedZone: string | null;
  onFilterClick: (category: "city" | "zone" | "neighborhood", id: string) => void;
}

export function LocationFilter({ 
  selectedFilters, 
  selectedZone, 
  onFilterClick 
}: LocationFilterProps) {
  const handleNeighborhoodClick = (id: string) => {
    // Check if neighborhood is already selected, in which case we'll remove it
    if (selectedFilters.neighborhood.includes(id)) {
      onFilterClick("neighborhood", id);
      return;
    }
    
    // Don't allow more than 3 neighborhoods
    if (selectedFilters.neighborhood.length >= 3) {
      toast({
        title: "Limite atingido",
        description: "Você só pode selecionar até 3 bairros",
        variant: "destructive",
      });
      return;
    }
    
    // Otherwise add the neighborhood
    onFilterClick("neighborhood", id);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium mb-2">Cidade</h4>
      <div className="grid grid-cols-2 gap-2">
        {cities.map((city) => (
          <FilterButton
            key={city.id}
            id={city.id}
            label={city.label}
            selected={selectedFilters.city.includes(city.id)}
            onClick={() => onFilterClick("city", city.id)}
          />
        ))}
      </div>
      
      <h4 className="text-sm font-medium mt-4 mb-2">Zona</h4>
      <div className="grid grid-cols-1 gap-2">
        {zones.map((zone) => (
          <FilterButton
            key={zone.id}
            id={zone.id}
            label={zone.label}
            selected={selectedFilters.zone.includes(zone.id)}
            onClick={() => onFilterClick("zone", zone.id)}
          />
        ))}
      </div>
      
      {selectedZone && zoneNeighborhoods[selectedZone] && (
        <>
          <h4 className="text-sm font-medium mt-4 mb-2">
            Bairros <span className="text-xs text-cyrela-gray-dark">(até 3)</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {zoneNeighborhoods[selectedZone].map((neighborhood) => (
              <FilterButton
                key={neighborhood.id}
                id={neighborhood.id}
                label={neighborhood.label}
                selected={selectedFilters.neighborhood.includes(neighborhood.id)}
                onClick={() => handleNeighborhoodClick(neighborhood.id)}
              />
            ))}
          </div>
          <div className="mt-1 text-xs text-cyrela-gray-dark">
            {selectedFilters.neighborhood.length}/3 bairros selecionados
          </div>
        </>
      )}
    </div>
  );
}
