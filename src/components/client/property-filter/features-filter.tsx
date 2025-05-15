
import { FilterButton } from "./filter-button";
import { bedrooms } from "./filter-data";

interface FeaturesFilterProps {
  selectedFilters?: string[];
  onFilterClick?: (id: string) => void;
  selected?: string[];
  onChange?: (values: string[]) => void;
}

export function FeaturesFilter({ 
  selectedFilters, 
  onFilterClick,
  selected,
  onChange
}: FeaturesFilterProps) {
  // For compatibility with property-filter component
  const actualSelected = selected || selectedFilters || [];
  
  const handleClick = (id: string) => {
    if (onChange && selected) {
      const newSelected = actualSelected.includes(id)
        ? actualSelected.filter(item => item !== id)
        : [...actualSelected, id];
      onChange(newSelected);
    } else if (onFilterClick) {
      onFilterClick(id);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium mb-2">Dormitórios</h4>
      <div className="grid grid-cols-4 gap-2">
        {bedrooms.map((bedroom) => (
          <FilterButton
            key={bedroom.id}
            id={bedroom.id}
            label={bedroom.label}
            selected={actualSelected.includes(bedroom.id)}
            onClick={() => handleClick(bedroom.id)}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
