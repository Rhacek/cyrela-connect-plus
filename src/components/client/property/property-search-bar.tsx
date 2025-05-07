
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { FilterButton } from "@/components/client/property-filter/filter-button";
import { cities, zones } from "@/components/client/property-filter/filter-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterCategory } from "@/components/client/property-filter/filter-types";

interface PropertySearchBarProps {
  selectedFilters: {
    city: string[];
    zone: string[];
  };
  onFilterChange: (category: FilterCategory, id: string) => void;
}

export function PropertySearchBar({
  selectedFilters,
  onFilterChange
}: PropertySearchBarProps) {
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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
    <div className={`sticky top-[69px] z-10 transition-transform duration-300 ease-in-out ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="relative bg-white rounded-md p-3 shadow-sm border border-cyrela-gray-lighter">
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
            
            <ScrollArea className="w-full">
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
                  <MapPin size={16} className="mr-1" />
                  Localização:
                </div>
                
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div className="col-span-4 mb-1">
                    <div className="text-xs text-cyrela-gray-dark">Cidade</div>
                  </div>
                  {cities.map((city) => (
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
                
                <div className="flex-1 grid grid-cols-4 gap-2 pl-2 border-l border-cyrela-gray-lighter">
                  <div className="col-span-4 mb-1">
                    <div className="text-xs text-cyrela-gray-dark">Zona</div>
                  </div>
                  {zones.map((zone) => (
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
      </div>
    </div>
  );
}
