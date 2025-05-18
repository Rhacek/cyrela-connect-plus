
import { Building, Calendar, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AppointmentTypeFilterProps {
  selectedTypes: string[];
  onFilterChange: (types: string[]) => void;
}

export function AppointmentTypeFilter({ selectedTypes, onFilterChange }: AppointmentTypeFilterProps) {
  // Define filter options
  const filterOptions = [
    { id: "visit", label: "Visitas", icon: Building },
    { id: "meeting", label: "Reuniões", icon: Calendar },
    { id: "call", label: "Ligações", icon: Phone }
  ];

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-2">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyrela-gray-dark">Filtrar:</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <ToggleGroup 
            type="multiple" 
            variant="outline"
            value={selectedTypes}
            onValueChange={(value) => onFilterChange(value)}
            className="border-none mt-1"
          >
            {filterOptions.map((option) => (
              <ToggleGroupItem
                key={option.id}
                value={option.id}
                aria-label={`Filtrar por ${option.label}`}
                size="sm"
                className="text-xs py-1 px-2 rounded-md data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
              >
                <option.icon className="h-3 w-3 mr-1" />
                <span>{option.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
