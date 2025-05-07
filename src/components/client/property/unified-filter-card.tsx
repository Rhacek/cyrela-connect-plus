
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterButton } from "@/components/client/property-filter/filter-button";
import { constructionStages, bedrooms, cities, zones } from "@/components/client/property-filter/filter-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { Card } from "@/components/ui/card";

interface UnifiedFilterCardProps {
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
}

export function UnifiedFilterCard({
  selectedFilters,
  onFilterChange
}: UnifiedFilterCardProps) {
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
          >
            Limpar filtros
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          {showLeftArrow && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
              onClick={() => scroll('left')}
            >
              <ChevronLeft size={18} />
            </Button>
          )}
          
          <ScrollArea className="w-full">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 pl-1 pr-1 scroll-smooth scrollbar-hide"
              onScroll={() => {
                if (!scrollContainerRef.current) return;
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowLeftArrow(scrollLeft > 0);
                setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
              }}
            >
              {/* Location Filter Section */}
              <div className="mb-6">
                <div className="flex-none font-medium text-sm text-cyrela-gray-dark flex items-center mb-3">
                  <MapPin size={16} className="mr-1" />
                  Localização
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                  <div className="col-span-2">
                    <div className="text-xs text-cyrela-gray-dark mb-1">Cidade</div>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.slice(0, 2).map((city) => (
                        <FilterButton
                          key={city.id}
                          id={city.id}
                          label={city.label}
                          selected={selectedFilters.city.includes(city.id)}
                          onClick={() => onFilterChange("city", city.id)}
                          variant="compact"
                          className="w-full whitespace-nowrap"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-span-4">
                    <div className="text-xs text-cyrela-gray-dark mb-1">Zona</div>
                    <div className="grid grid-cols-4 gap-2">
                      {zones.slice(0, 4).map((zone) => (
                        <FilterButton
                          key={zone.id}
                          id={zone.id}
                          label={zone.label}
                          selected={selectedFilters.zone.includes(zone.id)}
                          onClick={() => onFilterChange("zone", zone.id)}
                          variant="compact"
                          className="w-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Filters Section */}
              <div>
                <div className="flex-none font-medium text-sm text-cyrela-gray-dark flex items-center mb-3">
                  Filtros Rápidos
                </div>
                
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
              </div>
            </div>
          </ScrollArea>
          
          {showRightArrow && !isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
              onClick={() => scroll('right')}
            >
              <ChevronRight size={18} />
            </Button>
          )}
        </div>
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
