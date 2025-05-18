
import { FilterButton } from "./filter-button";
import { cities, zones, zoneNeighborhoods } from "./filter-data";
import { useLocationFilter } from "@/hooks/use-location-filter";

interface LocationFilterProps {
  selectedFilters?: {
    city: string[];
    zone: string[];
    neighborhood: string[];
  };
  selectedZone?: string | null;
  onFilterClick?: (category: "city" | "zone" | "neighborhood", id: string) => void;
  selected?: string[];
  onChange?: (values: string[]) => void;
}

export function LocationFilter({ 
  selectedFilters, 
  selectedZone: externalSelectedZone, 
  onFilterClick,
  selected,
  onChange
}: LocationFilterProps) {
  // Use the custom hook if we're using the new API
  const {
    selectedZone,
    locations,
    handleZoneSelection,
    handleFilterClick
  } = useLocationFilter(
    selected, 
    externalSelectedZone || null
  );
  
  // Support both APIs
  const handleNeighborhoodSelection = (id: string) => {
    // Handle the old API
    if (selectedFilters && onFilterClick) {
      onFilterClick("neighborhood", id);
      return;
    }
    
    // Handle the new API
    if (selected !== undefined && onChange) {
      handleFilterClick(id);
      const updatedSelection = selected.includes(id)
        ? selected.filter(item => item !== id)
        : [...selected, id];
      onChange(updatedSelection);
    }
  };

  // Use for compatibility with the property-filter component
  if (selected !== undefined && onChange) {
    return (
      <div className="space-y-3">
        {cities.map((city) => (
          <FilterButton
            key={city.id}
            id={city.id}
            label={city.label}
            selected={selected.includes(city.id)}
            onClick={() => {
              const updatedSelection = selected.includes(city.id)
                ? selected.filter(item => item !== city.id)
                : [...selected, city.id];
              onChange(updatedSelection);
            }}
          />
        ))}
      </div>
    );
  }

  // Original implementation
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium mb-2">Cidade</h4>
      <div className="grid grid-cols-2 gap-2">
        {cities.map((city) => (
          <FilterButton
            key={city.id}
            id={city.id}
            label={city.label}
            selected={selectedFilters?.city.includes(city.id) || false}
            onClick={() => onFilterClick && onFilterClick("city", city.id)}
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
            selected={selectedFilters?.zone.includes(zone.id) || false}
            onClick={() => {
              if (onFilterClick) onFilterClick("zone", zone.id);
              if (externalSelectedZone === undefined) {
                handleZoneSelection(selectedZone === zone.id ? null : zone.id);
              }
            }}
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
                selected={selectedFilters?.neighborhood.includes(neighborhood.id) || false}
                onClick={() => handleNeighborhoodSelection(neighborhood.id)}
              />
            ))}
          </div>
          <div className="mt-1 text-xs text-cyrela-gray-dark">
            {(selectedFilters?.neighborhood.length || 0)}/3 bairros selecionados
          </div>
        </>
      )}
    </div>
  );
}
