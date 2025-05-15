
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterCategory, defaultFilterState } from "./filter-types";
import { LocationFilter } from "./location-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { FeaturesFilter } from "./features-filter";
import { PriceRangeFilter } from "./price-range-filter";
import { SearchInput } from "./search-input";
import { cn } from "@/lib/utils";

interface PropertyFilterProps {
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
  onApplyFilters?: (filters: Record<FilterCategory, string[]>) => void;
  onReset?: () => void;
  priceRange?: number[];
  onPriceRangeChange?: (range: number[]) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export function PropertyFilter({
  selectedFilters = defaultFilterState,
  onFilterChange,
  onApplyFilters,
  onReset,
  priceRange,
  onPriceRangeChange,
  searchValue = "",
  onSearchChange,
  onSearch,
  className
}: PropertyFilterProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  
  // Determine if a zone is selected to show neighborhoods
  const selectedZone = selectedFilters.zone.length > 0 ? selectedFilters.zone[0] : null;
  
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  
  const getAppliedFiltersCount = () => {
    return Object.values(selectedFilters).reduce((count, filterList) => count + filterList.length, 0);
  };
  
  return (
    <div className={cn("p-4 space-y-4 overflow-y-auto bg-white rounded-md shadow-sm", className)}>
      {/* Search input */}
      {onSearchChange && (
        <div className="mb-5">
          <SearchInput
            value={localSearchValue}
            onChange={handleSearchChange}
            onSearch={onSearch}
            className="mb-2"
          />
        </div>
      )}
      
      {/* Construction Stage Filter */}
      <div>
        <h3 className="text-base font-semibold mb-3">Estágio da Obra</h3>
        <ConstructionStageFilter
          selectedFilters={selectedFilters.constructionStage}
          onFilterClick={(id) => onFilterChange("constructionStage", id)}
        />
      </div>
      
      {/* Price Range Filter */}
      {onPriceRangeChange && (
        <div>
          <h3 className="text-base font-semibold mb-3">Faixa de Preço</h3>
          <PriceRangeFilter
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
          />
        </div>
      )}
      
      {/* Location Filter */}
      <div>
        <h3 className="text-base font-semibold mb-3">Localização</h3>
        <LocationFilter
          selectedFilters={{
            city: selectedFilters.city,
            zone: selectedFilters.zone,
            neighborhood: selectedFilters.neighborhood
          }}
          selectedZone={selectedZone}
          onFilterClick={(category, id) => onFilterChange(category as FilterCategory, id)}
        />
      </div>
      
      {/* Features Filter */}
      <div>
        <h3 className="text-base font-semibold mb-3">Características</h3>
        <FeaturesFilter
          selectedFilters={selectedFilters.bedrooms}
          onFilterClick={(id) => onFilterChange("bedrooms", id)}
        />
      </div>
      
      {/* Action buttons */}
      {(onApplyFilters || onReset) && (
        <div className="flex gap-2 pt-3 border-t">
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="flex-1"
            >
              Limpar
            </Button>
          )}
          {onApplyFilters && (
            <Button
              onClick={() => onApplyFilters(selectedFilters)}
              className="flex-1 text-base"
              disabled={getAppliedFiltersCount() === 0}
            >
              Aplicar {getAppliedFiltersCount() > 0 && `(${getAppliedFiltersCount()})`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
