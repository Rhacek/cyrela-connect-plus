
import { FilterOption } from "./filter-types";
import { FilterButton } from "./filter-button";
import { constructionStages } from "./filter-data";

interface ConstructionStageFilterProps {
  selectedFilters: string[];
  onFilterClick: (id: string) => void;
}

export function ConstructionStageFilter({ 
  selectedFilters, 
  onFilterClick 
}: ConstructionStageFilterProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {constructionStages.map((stage: FilterOption) => (
        <FilterButton
          key={stage.id}
          id={stage.id}
          label={stage.label}
          selected={selectedFilters.includes(stage.id)}
          onClick={() => onFilterClick(stage.id)}
        />
      ))}
    </div>
  );
}
