
import { useState } from "react";
import { PropertyFilter } from "@/components/client/property-filter";
import { PropertyHeader } from "@/components/client/property/property-header";
import { PropertySearchBar } from "@/components/client/property/property-search-bar";
import { PropertyListings } from "@/components/client/property/property-listings";
import { MobileActions } from "@/components/client/property/mobile-actions";
import { QuickFilters } from "@/components/client/property/quick-filters";
import { mockProperties } from "@/mocks/property-data";
import { FilterCategory } from "@/components/client/property-filter/filter-types";
import { UnifiedFilterCard } from "@/components/client/property/unified-filter-card";

// Mock broker phone number - in a real app, this would come from a context or API
const BROKER_PHONE = "(11) 98765-4321";

const PropertyListingPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  const [selectedFilters, setSelectedFilters] = useState<Record<FilterCategory, string[]>>({
    constructionStage: [],
    city: [],
    zone: [],
    neighborhood: [],
    bedrooms: [],
  });
  
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
  
  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
    // Here you would filter the properties based on the selected filters
  };

  const handleFilteredPropertiesChange = (properties: any[]) => {
    setFilteredProperties(properties);
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
        <PropertyListings properties={filteredProperties || mockProperties} />
        
        {/* Unified Filter Card - New Search Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-cyrela-gray-dark mb-3">
            Fazer Nova Busca
          </h2>
          <UnifiedFilterCard
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* Sidebar filters - Only visible in mobile when filter is open */}
        <div className={`
          ${isMobileFilterOpen ? 'fixed' : 'hidden'} 
          lg:hidden lg:relative top-[133px] lg:top-0 left-0 w-full h-[calc(100vh-133px)] lg:h-auto lg:w-auto
          z-50 bg-cyrela-gray-lightest lg:bg-transparent
          overflow-y-auto lg:overflow-visible p-4 lg:p-0
        `}>
          <div className="sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                className="text-cyrela-gray-dark hover:text-cyrela-blue"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <PropertyFilter 
              onFilterChange={handleFilteredPropertiesChange}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile actions with WhatsApp button */}
      <MobileActions 
        isMobileFilterOpen={isMobileFilterOpen}
        onOverlayClick={() => setIsMobileFilterOpen(false)}
        onFilterClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        brokerPhone={BROKER_PHONE}
      />
    </div>
  );
};

export default PropertyListingPage;
