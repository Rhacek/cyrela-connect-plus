
import { FilterButton } from "./filter-button";
import { bedrooms } from "./filter-data";

interface FeaturesFilterProps {
  selectedFilters: string[];
  onFilterClick: (id: string) => void;
}

export function FeaturesFilter({ selectedFilters, onFilterClick }: FeaturesFilterProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium mb-2">Dormitórios</h4>
      <div className="grid grid-cols-4 gap-2">
        {bedrooms.map((bedroom) => (
          <FilterButton
            key={bedroom.id}
            id={bedroom.id}
            label={bedroom.label}
            selected={selectedFilters.includes(bedroom.id)}
            onClick={() => onFilterClick(bedroom.id)}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
