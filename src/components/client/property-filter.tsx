
import { useState } from "react";
import { X, Search, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface FilterOption {
  id: string;
  label: string;
}

interface PropertyFilterProps {
  className?: string;
  onApplyFilters?: (filters: any) => void;
  onReset?: () => void;
}

const constructionStages: FilterOption[] = [
  { id: "ready", label: "Pronto para morar" },
  { id: "construction", label: "Em construção" },
  { id: "planning", label: "Na planta" },
];

const cities: FilterOption[] = [
  { id: "saopaulo", label: "São Paulo" },
  { id: "santos", label: "Santos" },
  { id: "cotia", label: "Cotia" },
];

const zones: FilterOption[] = [
  { id: "zonasul", label: "Zona Sul" },
  { id: "zonanorte", label: "Zona Norte" },
  { id: "zonaleste", label: "Zona Leste" },
  { id: "zonaoeste", label: "Zona Oeste" },
  { id: "abcpaulista", label: "ABC Paulista" },
];

// Sample neighborhoods for Zone Sul
const zoneNeighborhoods: Record<string, FilterOption[]> = {
  zonasul: [
    { id: "campobelo", label: "Campo Belo" },
    { id: "ibirapuera", label: "Ibirapuera" },
    { id: "klabin", label: "Klabin" },
    { id: "moema", label: "Moema" },
    { id: "morumbi", label: "Morumbi" },
    // We'd add more neighborhoods as needed
  ],
  zonanorte: [
    { id: "tucuruvi", label: "Tucuruvi" },
    { id: "freguesia", label: "Freguesia do Ó" },
  ],
  // We'd add more zones with their neighborhoods as needed
};

const bedrooms: FilterOption[] = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4+" },
];

export function PropertyFilter({ 
  className, 
  onApplyFilters, 
  onReset 
}: PropertyFilterProps) {
  const [priceRange, setPriceRange] = useState([500000, 2000000]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    constructionStage: [],
    city: [],
    zone: [],
    neighborhood: [],
    bedrooms: [],
  });
  
  const handleFilterClick = (category: string, id: string) => {
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
  
  const isFilterSelected = (category: string, id: string) => {
    return selectedFilters[category]?.includes(id) || false;
  };
  
  const handleReset = () => {
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
        priceRange,
        ...selectedFilters,
      };
      onApplyFilters(filters);
    }
  };
  
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={16} />
          <Input
            placeholder="Buscar por nome ou bairro"
            className="pl-9 cyrela-input text-sm"
          />
        </div>
        
        <Accordion type="single" collapsible className="mt-4 w-full">
          <AccordionItem value="price" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Faixa de preço</AccordionTrigger>
            <AccordionContent>
              <div className="px-1 pt-2 pb-6">
                <div className="flex justify-between text-xs text-cyrela-gray-dark mb-4">
                  <span>{formatCurrency(priceRange[0])}</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
                <Slider
                  defaultValue={priceRange}
                  min={300000}
                  max={5000000}
                  step={50000}
                  onValueChange={(value) => setPriceRange(value as number[])}
                  className="my-4"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="stage" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Estágio da obra</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-2">
                {constructionStages.map((stage) => (
                  <Button
                    key={stage.id}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "justify-start text-left text-sm h-auto py-1.5 overflow-hidden",
                      isFilterSelected("constructionStage", stage.id) && 
                      "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white"
                    )}
                    onClick={() => handleFilterClick("constructionStage", stage.id)}
                  >
                    {isFilterSelected("constructionStage", stage.id) && (
                      <CheckCheck size={16} className="mr-2 shrink-0" />
                    )}
                    <span className="truncate">{stage.label}</span>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="location" className="border-b border-cyrela-gray-lighter">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Localização</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <h4 className="text-sm font-medium mb-2">Cidade</h4>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city) => (
                    <Button
                      key={city.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left text-sm h-auto py-1.5 overflow-hidden",
                        isFilterSelected("city", city.id) && 
                        "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white"
                      )}
                      onClick={() => handleFilterClick("city", city.id)}
                    >
                      {isFilterSelected("city", city.id) && (
                        <CheckCheck size={16} className="mr-2 shrink-0" />
                      )}
                      <span className="truncate">{city.label}</span>
                    </Button>
                  ))}
                </div>
                
                <h4 className="text-sm font-medium mt-4 mb-2">Zona</h4>
                <div className="grid grid-cols-1 gap-2">
                  {zones.map((zone) => (
                    <Button
                      key={zone.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-start text-left text-sm h-auto py-1.5 overflow-hidden",
                        isFilterSelected("zone", zone.id) && 
                        "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white"
                      )}
                      onClick={() => handleFilterClick("zone", zone.id)}
                    >
                      {isFilterSelected("zone", zone.id) && (
                        <CheckCheck size={16} className="mr-2 shrink-0" />
                      )}
                      <span className="truncate">{zone.label}</span>
                    </Button>
                  ))}
                </div>
                
                {selectedZone && zoneNeighborhoods[selectedZone] && (
                  <>
                    <h4 className="text-sm font-medium mt-4 mb-2">
                      Bairros <span className="text-xs text-cyrela-gray-dark">(até 3)</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {zoneNeighborhoods[selectedZone].map((neighborhood) => (
                        <Button
                          key={neighborhood.id}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "justify-start text-left text-sm h-auto py-1.5 overflow-hidden",
                            isFilterSelected("neighborhood", neighborhood.id) && 
                            "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white"
                          )}
                          onClick={() => handleFilterClick("neighborhood", neighborhood.id)}
                        >
                          {isFilterSelected("neighborhood", neighborhood.id) && (
                            <CheckCheck size={16} className="mr-2 shrink-0" />
                          )}
                          <span className="truncate">{neighborhood.label}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="features" className="border-b-0">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">Características</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <h4 className="text-sm font-medium mb-2">Dormitórios</h4>
                <div className="grid grid-cols-4 gap-2">
                  {bedrooms.map((bedroom) => (
                    <Button
                      key={bedroom.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "justify-center p-1 text-sm h-8",
                        isFilterSelected("bedrooms", bedroom.id) && 
                        "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white"
                      )}
                      onClick={() => handleFilterClick("bedrooms", bedroom.id)}
                    >
                      {bedroom.label}
                    </Button>
                  ))}
                </div>
              </div>
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
