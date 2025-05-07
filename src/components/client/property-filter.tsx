import { useState } from "react";
import { X, Search, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
const constructionStages: FilterOption[] = [{
  id: "ready",
  label: "Pronto para morar"
}, {
  id: "construction",
  label: "Em construção"
}, {
  id: "planning",
  label: "Na planta"
}];
const cities: FilterOption[] = [{
  id: "saopaulo",
  label: "São Paulo"
}, {
  id: "santos",
  label: "Santos"
}, {
  id: "cotia",
  label: "Cotia"
}];
const zones: FilterOption[] = [{
  id: "zonasul",
  label: "Zona Sul"
}, {
  id: "zonanorte",
  label: "Zona Norte"
}, {
  id: "zonaleste",
  label: "Zona Leste"
}, {
  id: "zonaoeste",
  label: "Zona Oeste"
}, {
  id: "abcpaulista",
  label: "ABC Paulista"
}];

// Sample neighborhoods for Zone Sul
const zoneNeighborhoods: Record<string, FilterOption[]> = {
  zonasul: [{
    id: "campobelo",
    label: "Campo Belo"
  }, {
    id: "ibirapuera",
    label: "Ibirapuera"
  }, {
    id: "klabin",
    label: "Klabin"
  }, {
    id: "moema",
    label: "Moema"
  }, {
    id: "morumbi",
    label: "Morumbi"
  }
  // We'd add more neighborhoods as needed
  ],
  zonanorte: [{
    id: "tucuruvi",
    label: "Tucuruvi"
  }, {
    id: "freguesia",
    label: "Freguesia do Ó"
  }]
  // We'd add more zones with their neighborhoods as needed
};
const bedrooms: FilterOption[] = [{
  id: "1",
  label: "1"
}, {
  id: "2",
  label: "2"
}, {
  id: "3",
  label: "3"
}, {
  id: "4",
  label: "4+"
}];
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
    bedrooms: []
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
            neighborhood: []
          };
        } else {
          // Only allow one zone selection
          setSelectedZone(id);
          return {
            ...prev,
            [category]: [id],
            neighborhood: []
          };
        }
      } else if (category === "neighborhood") {
        // For neighborhoods, toggle selection
        if (current.includes(id)) {
          return {
            ...prev,
            [category]: current.filter(item => item !== id)
          };
        } else {
          // Only allow up to 3 neighborhoods
          if (current.length < 3) {
            return {
              ...prev,
              [category]: [...current, id]
            };
          }
          return prev;
        }
      } else {
        // For other categories, toggle selection
        if (current.includes(id)) {
          return {
            ...prev,
            [category]: current.filter(item => item !== id)
          };
        } else {
          return {
            ...prev,
            [category]: [...current, id]
          };
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
      bedrooms: []
    });
    if (onReset) {
      onReset();
    }
  };
  const handleApplyFilters = () => {
    if (onApplyFilters) {
      const filters = {
        priceRange,
        ...selectedFilters
      };
      onApplyFilters(filters);
    }
  };
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    });
  };
  return <div className={cn("bg-white border border-cyrela-gray-lighter rounded-lg shadow-sm overflow-hidden", className)}>
      
      
      
      
      
    </div>;
}