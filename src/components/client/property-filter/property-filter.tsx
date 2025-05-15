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

type PropertyFilterProps = {
  onSearch?: (query: string) => void;
  className?: string;
};

export const PropertyFilter = ({ 
  onSearch, 
  className = "" 
}: PropertyFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
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
            <div className="py-4 space-y-4">
              {/* Aqui seriam implementados os filtros específicos */}
              <p className="text-muted-foreground">Filtros serão implementados conforme necessidade.</p>
            </div>
            <SheetFooter>
              <Button onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </div>
  );
};
