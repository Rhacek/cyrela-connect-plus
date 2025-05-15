
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterCategory } from "./filter-types";
import { ConstructionStageFilter } from "./construction-stage-filter";
import { FeaturesFilter } from "./features-filter";
import { SearchInput } from "./search-input";

type PropertyFilterProps = {
  onSearch?: (query: string) => void;
  className?: string;
  selectedFilters?: Record<FilterCategory, string[]>;
  onFilterChange?: (category: FilterCategory, id: string) => void;
  onApplyFilters?: (filters: any) => void;
  onReset?: () => void;
};

export const PropertyFilter = ({ 
  onSearch, 
  className = "",
  selectedFilters = {},
  onFilterChange,
  onApplyFilters,
  onReset
}: PropertyFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    if (onApplyFilters) {
      onApplyFilters(selectedFilters);
    }
  };

  return (
    <div className={`w-full flex flex-col space-y-4 ${className}`}>
      <form onSubmit={handleSearch} className="flex w-full space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imóveis..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" type="button">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros de Busca</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {selectedFilters && onFilterChange && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Estágio de Construção</h4>
                    <ConstructionStageFilter 
                      selectedFilters={selectedFilters.constructionStage || []}
                      onFilterClick={(id) => onFilterChange("constructionStage", id)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FeaturesFilter 
                      selectedFilters={selectedFilters.bedrooms || []}
                      onFilterClick={(id) => onFilterChange("bedrooms", id)}
                    />
                  </div>
                </>
              )}
              {!selectedFilters && (
                <p className="text-muted-foreground">Filtros serão implementados conforme necessidade.</p>
              )}
            </div>
            <SheetFooter className="pt-4 flex justify-between border-t">
              {onReset && (
                <Button variant="outline" onClick={onReset}>
                  Limpar
                </Button>
              )}
              <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </div>
  );
};
