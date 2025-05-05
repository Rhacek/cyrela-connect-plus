
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PropertyFilterProps, FilterCategory } from "./filter-types";
import { SearchInput } from "./search-input";
import { PriceRangeFilter } from "./price-range-filter";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { LocationFilter } from "./location-filter";
import { FeaturesFilter } from "./features-filter";

export function PropertyFilter({ 
  className, 
  onApplyFilters, 
  onReset 
}: PropertyFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([500000, 2000000]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<FilterCategory, string[]>>({
    constructionStage: [],
    city: [],
    zone: [],
    neighborhood: [],
    bedrooms: [],
  });
  
  const handleFilterClick = (category: FilterCategory, id: string) => {
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
          setSelectedZone(id);
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
  
  const handleReset = () => {
    setSearchQuery("");
    setPriceRange([500000, 2000000]);
    setSelectedZone(null);
    setSelectedFilters({
      constructionStage: [],
      city: [],
      zone: [],
      neighborhood: [],
      bedrooms: [],
    });
    
    if (onReset) {
      onReset();
    }
  };
  
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      const filters = {
        searchQuery,
        priceRange,
        ...selectedFilters,
      };
      onApplyFilters(filters);
    }
  };
  
  return (
    <div className={cn("bg-white border border-cyrela-gray-lighter rounded-lg shadow-sm overflow-hidden", className)}>
      <div className="p-4 border-b border-cyrela-gray-lighter flex justify-between items-center">
        <h3 className="font-medium truncate">Filtros</h3>
        <Button 
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-cyrela-gray-dark hover:text-cyrela-blue shrink-0 ml-2"
        >
          <X size={16} className="mr-1" />
          Limpar
        </Button>
      </div>
      
      <div className="p-4">
        <SearchInput 
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        <Accordion type="single" collapsible className="mt-4 w-full">
          <AccordionItem value="price" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Faixa de preço</AccordionTrigger>
            <AccordionContent>
              <PriceRangeFilter 
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="stage" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Estágio da obra</AccordionTrigger>
            <AccordionContent>
              <ConstructionStageFilter 
                selectedFilters={selectedFilters.constructionStage}
                onFilterClick={(id) => handleFilterClick("constructionStage", id)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="location" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Localização</AccordionTrigger>
            <AccordionContent>
              <LocationFilter 
                selectedFilters={{
                  city: selectedFilters.city,
                  zone: selectedFilters.zone,
                  neighborhood: selectedFilters.neighborhood
                }}
                selectedZone={selectedZone}
                onFilterClick={(category, id) => handleFilterClick(category as FilterCategory, id)}
              />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="features" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Características</AccordionTrigger>
            <AccordionContent>
              <FeaturesFilter 
                selectedFilters={selectedFilters.bedrooms}
                onFilterClick={(id) => handleFilterClick("bedrooms", id)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="p-4 border-t border-cyrela-gray-lighter">
        <Button
          className="w-full bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
          onClick={handleApplyFilters}
        >
          Aplicar filtros
        </Button>
      </div>
    </div>
  );
}
