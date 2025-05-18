
import { useState, useEffect, ReactNode } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
}

interface PropertySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
}

export function PropertySelect({ value, onChange, placeholder = "Selecione um imóvel", icon }: PropertySelectProps) {
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        
        // Fetch active properties
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, city, neighborhood')
          .eq('is_active', true)
          .order('title', { ascending: true });
        
        if (error) {
          console.error('Error fetching properties:', error);
          return;
        }
        
        setProperties(data || []);
      } catch (err) {
        console.error('Unexpected error fetching properties:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [session?.id]);

  // Find the selected property
  const selectedProperty = properties.find(p => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            {selectedProperty ? (
              <span className="truncate">
                {selectedProperty.title} - {selectedProperty.neighborhood}, {selectedProperty.city}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar imóvel..." />
          <CommandEmpty>
            {isLoading ? "Carregando..." : "Nenhum imóvel encontrado."}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {properties.map((property) => (
              <CommandItem
                key={property.id}
                value={property.id}
                onSelect={() => {
                  onChange(property.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === property.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate">
                  {property.title} - {property.neighborhood}, {property.city}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
