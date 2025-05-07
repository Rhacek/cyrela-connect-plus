
import { useState } from "react";
import { PropertyFilter } from "@/components/client/property-filter";
import { PropertyHeader } from "@/components/client/property/property-header";
import { PropertySearchBar } from "@/components/client/property/property-search-bar";
import { PropertyListings } from "@/components/client/property/property-listings";
import { MobileActions } from "@/components/client/property/mobile-actions";
import { QuickFilters } from "@/components/client/property/quick-filters";
import { mockProperties } from "@/mocks/property-data";
import { FilterCategory } from "@/components/client/property-filter/filter-types";

const PropertyListingPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
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
      
      {/* Search bar */}
      <PropertySearchBar />
      
      <div className="flex-1 container mx-auto px-4 py-4">
        {/* Quick filters */}
        <QuickFilters 
          selectedFilters={{
            constructionStage: selectedFilters.constructionStage,
            bedrooms: selectedFilters.bedrooms
          }}
          onFilterChange={handleFilterChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar filters */}
          <div className={`
            ${isMobileFilterOpen ? 'fixed' : 'hidden'} 
            lg:block lg:relative top-[133px] lg:top-0 left-0 w-full h-[calc(100vh-133px)] lg:h-auto lg:w-auto
            z-50 bg-cyrela-gray-lightest lg:bg-transparent
            overflow-y-auto lg:overflow-visible p-4 lg:p-0
            lg:col-span-3
          `}>
            <div className="sticky top-4">
              <div className="flex justify-between items-center lg:hidden mb-4">
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
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onReset={handleResetFilters}
                className="max-h-[calc(100vh-180px)] lg:max-h-full overflow-auto"
              />
            </div>
          </div>
          
          {/* Property listings */}
          <div className="lg:col-span-9">
            <PropertyListings properties={mockProperties} />
          </div>
        </div>
      </div>
      
      {/* Mobile actions (floating button and overlay) */}
      <MobileActions 
        isMobileFilterOpen={isMobileFilterOpen}
        onOverlayClick={() => setIsMobileFilterOpen(false)}
        onFilterClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
      />
    </div>
  );
};

export default PropertyListingPage;
