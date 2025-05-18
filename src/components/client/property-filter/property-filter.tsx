
import { useState, useEffect } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { FilterButton } from "./filter-button";
import { PriceRangeFilter } from "./price-range-filter";
import { LocationFilter } from "./location-filter";
import { FeaturesFilter } from "./features-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { Property } from "@/types";
import { useLocationFilter } from "@/hooks/use-location-filter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PropertyFilterProps {
  onFilterChange?: (filteredProperties: Property[]) => void;
  initialFilters?: {
    search?: string;
    priceRange?: [number, number];
    locations?: string[];
    features?: string[];
    stages?: string[];
  };
  properties?: Property[];
  isLoading?: boolean;
}

export function PropertyFilter({ 
  onFilterChange,
  initialFilters,
  properties = [],
  isLoading = false
}: PropertyFilterProps) {
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [500000, 5000000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Use the location filter hook
  const {
    selectedZone,
    locations,
    handleZoneSelection,
    setLocations
  } = useLocationFilter(initialFilters?.locations || []);
  
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(initialFilters?.features || []);
  const [stages, setStages] = useState<string[]>(initialFilters?.stages || []);

  // Get active filters count for the badge
  const getActiveFiltersCount = () => {
    return locations.length + selectedFeatures.length + stages.length;
  };

  // Apply filters and notify parent
  const applyFilters = () => {
    if (!onFilterChange) return;

    const filtered = properties.filter((property) => {
      // Search filter
      const searchMatches = search === "" || 
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase()) ||
        property.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
        property.city.toLowerCase().includes(search.toLowerCase());

      // Price filter
      const priceMatches = property.price >= priceRange[0] && property.price <= priceRange[1];

      // Location filter (city and neighborhood)
      const locationMatches = locations.length === 0 || 
        locations.some(loc => property.neighborhood === loc || property.city === loc);

      // Features filter (based on bedrooms)
      const featureMatches = selectedFeatures.length === 0 || 
        selectedFeatures.some(feature => {
          if (feature === "1") return property.bedrooms === 1;
          if (feature === "2") return property.bedrooms === 2;
          if (feature === "3") return property.bedrooms === 3;
          if (feature === "4") return property.bedrooms >= 4;
          return false;
        });

      // Construction stage filter
      const stageMatches = stages.length === 0 || 
        (property.constructionStage && stages.includes(property.constructionStage));

      return searchMatches && priceMatches && locationMatches && featureMatches && stageMatches;
    });

    onFilterChange(filtered);
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [search, priceRange, locations, selectedFeatures, stages]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput 
          value={search} 
          onChange={(value) => {
            setSearch(value);
          }} 
          className="flex-1" 
          isLoading={isLoading}
        />
        
        <Collapsible 
          open={isFilterOpen} 
          onOpenChange={setIsFilterOpen}
          className="w-full sm:w-auto"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="flex w-full sm:w-auto justify-between items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span>Filtros</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="w-full data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <FilterButton title="Preço">
                <PriceRangeFilter 
                  value={priceRange} 
                  onChange={(value) => {
                    setPriceRange(value);
                  }} 
                  min={500000} 
                  max={5000000} 
                />
              </FilterButton>
              
              <FilterButton title="Localização">
                <LocationFilter 
                  selected={locations} 
                  onChange={(values) => {
                    setLocations(values);
                  }}
                  selectedZone={selectedZone}
                />
              </FilterButton>
              
              <FilterButton title="Quartos">
                <FeaturesFilter 
                  selected={selectedFeatures} 
                  onChange={(values) => {
                    setSelectedFeatures(values);
                  }} 
                />
              </FilterButton>
              
              <FilterButton title="Estágio">
                <ConstructionStageFilter 
                  selected={stages} 
                  onChange={(values) => {
                    setStages(values);
                  }} 
                />
              </FilterButton>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
