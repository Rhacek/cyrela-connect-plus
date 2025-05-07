
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
import { LocationFilter } from "./location-filter";

export function PropertyFilter({ 
  className, 
  onApplyFilters, 
  onReset,
  selectedFilters,
  onFilterChange
}: PropertyFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([500000, 2000000]);
  
  const handleReset = () => {
    setSearchQuery("");
    setPriceRange([500000, 2000000]);
    
    if (onReset) {
      onReset();
    }
  };
  
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      const filters = {
        searchQuery,
        priceRange,
      };
      onApplyFilters(filters);
    }
  };
  
  return (
    <div className={cn("bg-white border border-cyrela-gray-lighter rounded-lg shadow-sm overflow-hidden", className)}>
      <div className="p-4 border-b border-cyrela-gray-lighter flex justify-between items-center">
        <h3 className="font-medium truncate">Filtros avançados</h3>
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
          
          <AccordionItem value="location" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Localização</AccordionTrigger>
            <AccordionContent>
              <LocationFilter 
                selectedFilters={{
                  city: selectedFilters.city,
                  zone: selectedFilters.zone,
                  neighborhood: selectedFilters.neighborhood
                }}
                selectedZone={selectedFilters.zone[0] || null}
                onFilterClick={(category, id) => onFilterChange(category as FilterCategory, id)}
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
