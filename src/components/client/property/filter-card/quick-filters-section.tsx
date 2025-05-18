
import { FilterButton } from "@/components/client/property-filter/filter-button";
import { constructionStages, bedrooms } from "@/components/client/property-filter/filter-data";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { FilterSection } from "./filter-section";

interface QuickFiltersSectionProps {
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
}

export function QuickFiltersSection({
  isExpanded,
  onToggleExpand,
  selectedFilters,
  onFilterChange
}: QuickFiltersSectionProps) {
  return (
    <FilterSection 
      title="Filtros Rápidos"
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-cyrela-gray-dark mb-1">Estágio</div>
          <div className="grid grid-cols-3 gap-2">
            {constructionStages.map((stage) => (
              <FilterButton
                key={stage.id}
                id={stage.id}
                label={stage.label}
                selected={selectedFilters.constructionStage.includes(stage.id)}
                onClick={() => onFilterChange("constructionStage", stage.id)}
                variant="compact"
                className="w-full whitespace-nowrap"
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-cyrela-gray-dark mb-1">Dormitórios</div>
          <div className="grid grid-cols-4 gap-2">
            {bedrooms.map((bedroom) => (
              <FilterButton
                key={bedroom.id}
                id={bedroom.id}
                label={bedroom.label}
                selected={selectedFilters.bedrooms.includes(bedroom.id)}
                onClick={() => onFilterChange("bedrooms", bedroom.id)}
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
