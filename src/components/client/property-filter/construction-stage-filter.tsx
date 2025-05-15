
import { FilterOption } from "./filter-types";
import { FilterButton } from "./filter-button";
import { constructionStages } from "./filter-data";

interface ConstructionStageFilterProps {
  selectedFilters?: string[];
  onFilterClick?: (id: string) => void;
  selected?: string[];
  onChange?: (values: string[]) => void;
}

export function ConstructionStageFilter({ 
  selectedFilters, 
  onFilterClick,
  selected,
  onChange 
}: ConstructionStageFilterProps) {
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
    <div className="grid grid-cols-1 gap-2">
      {constructionStages.map((stage: FilterOption) => (
        <FilterButton
          key={stage.id}
          id={stage.id}
          label={stage.label}
          selected={actualSelected.includes(stage.id)}
          onClick={() => handleClick(stage.id)}
        />
      ))}
    </div>
  );
}
