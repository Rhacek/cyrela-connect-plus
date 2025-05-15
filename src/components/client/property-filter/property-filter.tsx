
import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { FilterButton } from "./filter-button";
import { PriceRangeFilter } from "./price-range-filter";
import { LocationFilter } from "./location-filter";
import { FeaturesFilter } from "./features-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { propertiesService } from "@/services/properties.service";
import { useQuery } from "@tanstack/react-query";

export function PropertyFilter({ onFilterChange }: { onFilterChange?: (filteredProperties: any[]) => void }) {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([500000, 5000000]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch all properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertiesService.getAll(),
  });

  // Apply filters
  useEffect(() => {
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

      // Location filter
      const locationMatches = locations.length === 0 || 
        locations.some(loc => property.neighborhood === loc || property.city === loc);

      // Features filter (simplified - would need proper feature property)
      const featureMatches = selectedFeatures.length === 0;

      // Construction stage filter
      const stageMatches = stages.length === 0 || 
        (property.constructionStage && stages.includes(property.constructionStage));

      return searchMatches && priceMatches && locationMatches && featureMatches && stageMatches;
    });

    onFilterChange(filtered);
  }, [properties, search, priceRange, locations, selectedFeatures, stages, onFilterChange]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput 
          value={search} 
          onChange={setSearch} 
          className="flex-1" 
          isLoading={isLoading}
        />
        
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2"
        >
          <Filter size={16} />
          Filtros
        </Button>
      </div>
      
      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <FilterButton title="Preço">
            <PriceRangeFilter 
              value={priceRange} 
              onChange={setPriceRange} 
              min={500000} 
              max={5000000} 
            />
          </FilterButton>
          
          <FilterButton title="Localização">
            <LocationFilter 
              selected={locations} 
              onChange={setLocations} 
            />
          </FilterButton>
          
          <FilterButton title="Características">
            <FeaturesFilter 
              selected={selectedFeatures} 
              onChange={setSelectedFeatures} 
            />
          </FilterButton>
          
          <FilterButton title="Estágio">
            <ConstructionStageFilter 
              selected={stages} 
              onChange={setStages} 
            />
          </FilterButton>
        </div>
      )}
    </div>
  );
}
