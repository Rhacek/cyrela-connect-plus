
import { MapPin } from "lucide-react";
import { FilterButton } from "@/components/client/property-filter/filter-button";
import { cities, zones } from "@/components/client/property-filter/filter-data";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { FilterSection } from "./filter-section";

interface LocationSectionProps {
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
}

export function LocationSection({
  isExpanded,
  onToggleExpand,
  selectedFilters,
  onFilterChange
}: LocationSectionProps) {
  return (
    <FilterSection 
      title="Localização" 
      icon={<MapPin size={16} className="mr-1" />}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <div className="col-span-2">
          <div className="text-xs text-cyrela-gray-dark mb-1">Cidade</div>
          <div className="grid grid-cols-2 gap-2">
            {cities.slice(0, 2).map((city) => (
              <FilterButton
                key={city.id}
                id={city.id}
                label={city.label}
                selected={selectedFilters.city.includes(city.id)}
                onClick={() => onFilterChange("city", city.id)}
                variant="compact"
                className="w-full whitespace-nowrap"
              />
            ))}
          </div>
        </div>
        
        <div className="col-span-4">
          <div className="text-xs text-cyrela-gray-dark mb-1">Zona</div>
          <div className="grid grid-cols-4 gap-2">
            {zones.slice(0, 4).map((zone) => (
              <FilterButton
                key={zone.id}
                id={zone.id}
                label={zone.label}
                selected={selectedFilters.zone.includes(zone.id)}
                onClick={() => onFilterChange("zone", zone.id)}
                variant="compact"
                className="w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </FilterSection>
  );
}
