
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PropertyFilter } from "@/components/client/property-filter";
import { PropertyHeader } from "@/components/client/property/property-header";
import { PropertySearchBar } from "@/components/client/property/property-search-bar";
import { PropertyListings } from "@/components/client/property/property-listings";
import { MobileActions } from "@/components/client/property/mobile-actions";
import { QuickFilters } from "@/components/client/property/quick-filters";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { UnifiedFilterCard } from "@/components/client/property/filter-card";
import { usePropertyFilters } from "@/hooks/use-property-filters";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBrokerReferral } from "@/hooks/use-broker-referral";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyListingPage = () => {
  const location = useLocation();
  const { brokerId } = useBrokerReferral();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { 
    filters, 
    setFilters, 
    filteredProperties,
    isLoading
  } = usePropertyFilters([]);
  
  const [selectedFilters, setSelectedFilters] = useState<Record<FilterCategory, string[]>>({
    constructionStage: [],
    city: [],
    zone: [],
    neighborhood: [],
    bedrooms: [],
  });
  
  // Get broker phone from location state or use default
  const locationState = location.state as any;
  const BROKER_PHONE = brokerId ? "(11) 98765-4321" : ""; // In real app, fetch from broker profile
  
  const handleFilterChange = (category: FilterCategory, id: string) => {
    setSelectedFilters(prev => {
      const current = [...(prev[category] || [])];
      
      if (category === "zone") {
        // If selecting a zone, clear neighborhoods
        if (current.includes(id)) {
          return {
            ...prev, 
            [category]: current.filter(item => item !== id),
            neighborhood: [],
          };
        } else {
          // Only allow one zone selection
          return {
            ...prev, 
            [category]: [id],
            neighborhood: [],
          };
        }
      } else if (category === "neighborhood") {
        // For neighborhoods, toggle selection
        if (current.includes(id)) {
          return {...prev, [category]: current.filter(item => item !== id)};
        } else {
          // Only allow up to 3 neighborhoods
          if (current.length < 3) {
            return {...prev, [category]: [...current, id]};
          }
          return prev;
        }
      } else {
        // For other categories, toggle selection
        if (current.includes(id)) {
          return {...prev, [category]: current.filter(item => item !== id)};
        } else {
          return {...prev, [category]: [...current, id]};
        }
      }
    });
  };
  
  const handleResetFilters = () => {
    setSelectedFilters({
      constructionStage: [],
      city: [],
      zone: [],
      neighborhood: [],
      bedrooms: [],
    });
    console.log("Filters reset");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cyrela-gray-lightest">
      {/* Header */}
      <PropertyHeader />
      
      <div className="flex-1 container mx-auto px-2 sm:px-3 md:px-4 py-2 md:py-4 max-w-full">
        {/* Properties Found - Moved to top */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                <Skeleton className="h-40 w-full rounded-md mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PropertyListings properties={filteredProperties} />
        )}
        
        {/* Unified Filter Card - New Search Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-cyrela-gray-dark mb-3">
            Fazer Nova Busca
          </h2>
          <UnifiedFilterCard
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
        
        {/* Mobile filter overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileFilterOpen(false)} />
        )}
        
        {/* Sidebar filters - Only visible in mobile when filter is open */}
        <div className={`
          fixed lg:relative top-[133px] lg:top-0 left-0 
          w-full md:w-3/4 lg:w-auto h-[calc(100vh-133px)] lg:h-auto
          z-50 bg-cyrela-gray-lightest lg:bg-transparent
          transition-transform duration-300 ease-in-out
          transform ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto lg:overflow-visible p-4 lg:p-0
        `}>
          <div className="sticky top-4">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-cyrela-gray-dark hover:text-cyrela-blue"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <PropertyFilter 
              properties={filteredProperties}
              initialFilters={{
                search: filters.search,
                priceRange: filters.priceRange,
                locations: filters.locations,
                features: filters.selectedFeatures,
                stages: filters.stages
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile actions with WhatsApp button - Only show if broker referral */}
      {brokerId && (
        <MobileActions 
          isMobileFilterOpen={isMobileFilterOpen}
          onOverlayClick={() => setIsMobileFilterOpen(false)}
          onFilterClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          brokerPhone={BROKER_PHONE}
        />
      )}
    </div>
  );
};

export default PropertyListingPage;
