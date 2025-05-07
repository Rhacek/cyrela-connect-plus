
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterButton } from "@/components/client/property-filter/filter-button";
import { constructionStages, bedrooms } from "@/components/client/property-filter/filter-data";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuickFiltersProps {
  selectedFilters: {
    constructionStage: string[];
    bedrooms: string[];
  };
  onFilterChange: (category: "constructionStage" | "bedrooms", id: string) => void;
}

export function QuickFilters({ 
  selectedFilters, 
  onFilterChange 
}: QuickFiltersProps) {
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if scroll arrows should be visible
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollDistance = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'right' ? currentScroll + scrollDistance : currentScroll - scrollDistance,
      behavior: 'smooth'
    });
    
    // Update arrow visibility after scroll
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }, 300);
  };

  return (
    <div className="relative bg-white rounded-md p-3 mb-4 shadow-sm border border-cyrela-gray-lighter">
      <div className="flex items-center">
        {showLeftArrow && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
            onClick={() => scroll('left')}
          >
            <ChevronLeft size={18} />
          </Button>
        )}
        
        <ScrollArea className="w-full" orientation="horizontal">
          <div 
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto pb-1 pl-1 pr-1 whitespace-nowrap scroll-smooth scrollbar-hide"
            onScroll={() => {
              if (!scrollContainerRef.current) return;
              const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
              setShowLeftArrow(scrollLeft > 0);
              setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
            }}
          >
            <div className="flex-none font-medium text-sm text-cyrela-gray-dark flex items-center pr-2 border-r border-cyrela-gray-lighter">
              Filtros rápidos:
            </div>
            
            <div className="flex-none">
              <div className="text-xs text-cyrela-gray-dark mb-1">Estágio</div>
              <div className="flex gap-2">
                {constructionStages.map((stage) => (
                  <FilterButton
                    key={stage.id}
                    id={stage.id}
                    label={stage.label}
                    selected={selectedFilters.constructionStage.includes(stage.id)}
                    onClick={() => onFilterChange("constructionStage", stage.id)}
                    variant="compact"
                    className="whitespace-nowrap min-w-max"
                  />
                ))}
              </div>
            </div>
            
            <div className="flex-none pl-2 border-l border-cyrela-gray-lighter">
              <div className="text-xs text-cyrela-gray-dark mb-1">Dormitórios</div>
              <div className="flex gap-2">
                {bedrooms.map((bedroom) => (
                  <FilterButton
                    key={bedroom.id}
                    id={bedroom.id}
                    label={bedroom.label}
                    selected={selectedFilters.bedrooms.includes(bedroom.id)}
                    onClick={() => onFilterChange("bedrooms", bedroom.id)}
                    variant="compact"
                    className="min-w-12"
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {showRightArrow && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
