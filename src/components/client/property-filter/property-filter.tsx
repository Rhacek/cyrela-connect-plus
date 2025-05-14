
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { LocationFilter } from "./location-filter";
import { PriceRangeFilter } from "./price-range-filter";
import { FeaturesFilter } from "./features-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { FilterButton } from "./filter-button";
import { toast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterX, Filter, Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { 
  PropertyFilterState, 
  defaultFilterState, 
  FilterChangeHandler 
} from "./filter-types";

export const PropertyFilter = () => {
  const [filterState, setFilterState] = useState<PropertyFilterState>(defaultFilterState);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange: FilterChangeHandler = (filterKey, value) => {
    setFilterState(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilterState(defaultFilterState);
    toast.info("Filtros limpos com sucesso!");
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", filterState);
    toast.success("Filtros aplicados com sucesso!");
    setIsOpen(false);
    
    // In a real app, this would trigger an API call
  };

  const filterContent = (
    <div className="flex flex-col gap-6">
      <LocationFilter 
        selectedFilters={{
          city: filterState.locations || [],
          zone: filterState.locations || [],
          neighborhood: filterState.locations || []
        }}
        selectedZone={null}
        onFilterClick={(category, id) => handleFilterChange("locations", [...(filterState.locations || []), id])}
      />
      
      <PriceRangeFilter 
        priceRange={filterState.priceRange} 
        onPriceRangeChange={(value) => handleFilterChange("priceRange", value)}
      />
      
      <FeaturesFilter 
        selectedFilters={filterState.features || []}
        onFilterClick={(id) => {
          const features = [...(filterState.features || [])];
          const index = features.indexOf(id);
          if (index >= 0) {
            features.splice(index, 1);
          } else {
            features.push(id);
          }
          handleFilterChange("features", features);
        }}
      />
      
      <ConstructionStageFilter 
        selectedFilters={filterState.constructionStage ? [filterState.constructionStage] : []}
        onFilterClick={(id) => handleFilterChange("constructionStage", id)}
      />
      
      <div className="flex gap-3 mt-4">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={handleClearFilters}
        >
          <FilterX className="mr-2 h-4 w-4" />
          Limpar
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleApplyFilters}
        >
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="mb-6">
        <div className="flex gap-3">
          <SearchInput 
            value={filterState.search} 
            onChange={(value) => handleFilterChange("search", value)}
          />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              {filterContent}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5">
          <SearchInput 
            value={filterState.search} 
            onChange={(value) => handleFilterChange("search", value)}
          />
        </div>
        
        {filterContent}
      </div>
    </div>
  );
};
