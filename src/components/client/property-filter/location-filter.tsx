
import { FilterButton } from "./filter-button";
import { cities, zones, zoneNeighborhoods } from "./filter-data";

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
                onClick={() => onFilterClick("neighborhood", neighborhood.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
