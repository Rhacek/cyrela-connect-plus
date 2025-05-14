
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { LocationFilter } from "./location-filter";
import { PriceRangeFilter } from "./price-range-filter";
import { FeaturesFilter } from "./features-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { FilterButton } from "./filter-button";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterX, Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { FilterCategory, defaultFilterState } from "./filter-types";

interface PropertyFilterProps {
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
  onApplyFilters: (filters: any) => void;
  onReset: () => void;
  className?: string;
}

export function PropertyFilter({
  selectedFilters,
  onFilterChange,
  onApplyFilters,
  onReset,
  className
}: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get the selected zone
  const selectedZone = selectedFilters.zone.length > 0 ? selectedFilters.zone[0] : null;

  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
    toast.success("Filtros aplicados com sucesso!");
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    onReset();
    toast.info("Filtros limpos com sucesso!");
  };

  const filterContent = (
    <div className="flex flex-col gap-6">
      <LocationFilter
        selectedFilters={selectedFilters}
        selectedZone={selectedZone}
        onFilterClick={onFilterChange}
      />
      
      <PriceRangeFilter />
      
      <FeaturesFilter />
      
      <ConstructionStageFilter
        stage={selectedFilters.constructionStage}
        onChange={(value) => onFilterChange("constructionStage", value)}
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
      <div className={`mb-6 ${className || ''}`}>
        <div className="flex gap-3">
          <SearchInput
            onSearch={handleApplyFilters}
            className="flex-1"
          />
          
          <Sheet
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            <SheetTrigger asChild>
              <FilterButton
                count={Object.keys(selectedFilters).filter(key => 
                  selectedFilters[key as FilterCategory].length > 0
                ).length}
              />
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[80vh]"
            >
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
    <div className={`bg-card border rounded-lg p-6 mb-8 ${className || ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-5">
          <SearchInput
            onSearch={handleApplyFilters}
          />
        </div>
        {filterContent}
      </div>
    </div>
  );
}
