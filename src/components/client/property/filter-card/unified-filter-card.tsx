
import { useState, useRef } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationSection } from "./location-section";
import { QuickFiltersSection } from "./quick-filters-section";
import { ScrollControls } from "./scroll-controls";

interface UnifiedFilterCardProps {
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
  onResetFilters?: () => void;
}

export function UnifiedFilterCard({
  selectedFilters,
  onFilterChange,
  onResetFilters
}: UnifiedFilterCardProps) {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Collapsible sections state
  const [isLocationExpanded, setIsLocationExpanded] = useState(true);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  
  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0);
  
  return (
    <Card className="relative bg-white overflow-hidden shadow-sm border border-cyrela-gray-lighter">
      <div className="p-4 border-b border-cyrela-gray-lighter">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-cyrela-gray-dark" />
            <h3 className="font-medium text-cyrela-gray-dark">Filtros de busca</h3>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm bg-white hover:bg-cyrela-gray-lighter"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
          >
            Limpar filtros
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <ScrollControls 
          scrollContainerRef={scrollContainerRef}
          isMobile={isMobile}
        >
          <ScrollArea className="w-full">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 pl-1 pr-1 scroll-smooth scrollbar-hide"
              onScroll={() => {
                if (!scrollContainerRef.current) return;
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                const showLeft = scrollLeft > 0;
                const showRight = scrollLeft + clientWidth < scrollWidth - 5;
                
                // We access these through DOM to avoid unnecessary rerenders
                const leftArrow = document.querySelector('[data-scroll-left]');
                const rightArrow = document.querySelector('[data-scroll-right]');
                
                if (leftArrow) {
                  leftArrow.classList.toggle('hidden', !showLeft);
                }
                
                if (rightArrow) {
                  rightArrow.classList.toggle('hidden', !showRight);
                }
              }}
            >
              {/* Location Filter Section */}
              <LocationSection
                isExpanded={isLocationExpanded}
                onToggleExpand={setIsLocationExpanded}
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
              />
              
              {/* Quick Filters Section */}
              <QuickFiltersSection
                isExpanded={isFiltersExpanded}
                onToggleExpand={setIsFiltersExpanded}
                selectedFilters={selectedFilters}
                onFilterChange={onFilterChange}
              />
            </div>
          </ScrollArea>
        </ScrollControls>
      </div>
      
      <div className="p-4 border-t border-cyrela-gray-lighter flex justify-end">
        <Button 
          className="bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
        >
          Buscar
        </Button>
      </div>
    </Card>
  );
}
