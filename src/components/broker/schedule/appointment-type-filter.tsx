
import { Building, Calendar, Phone } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

  return (
    <div className="flex items-center space-x-1">
      <span className="text-xs text-cyrela-gray-dark mr-1">Filtrar:</span>
      <ToggleGroup 
        type="multiple" 
        variant="outline"
        value={selectedTypes}
        onValueChange={(value) => onFilterChange(value)}
        className="border-none"
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
    </div>
  );
}
