import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { useState, useEffect } from "react";
import { propertiesService } from "@/services/properties.service";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";

interface PropertySelectProps {
  onPropertySelect: (property: Property | null) => void;
  initialPropertyId?: string;
}

export function PropertySelect({ onPropertySelect, initialPropertyId }: PropertySelectProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertiesService.getAll();
        setProperties(data);
        
        // If initialPropertyId is provided, select that property
        if (initialPropertyId) {
          const initialProperty = data.find(p => p.id === initialPropertyId);
          if (initialProperty) {
            setSelectedProperty(initialProperty);
            onPropertySelect(initialProperty);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Erro ao carregar imóveis",
          description: "Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [initialPropertyId, onPropertySelect, toast]);

  // Format property options for combobox
  const propertyOptions = properties.map(property => ({
    value: property.id,
    label: `${property.title} - ${property.neighborhood}, ${property.city}`,
    property
  }));

  const handlePropertyChange = (value: string) => {
    const property = properties.find(p => p.id === value) || null;
    setSelectedProperty(property);
    onPropertySelect(property);
  };

  return (
    <div>
      <Combobox
        items={propertyOptions}
        value={selectedProperty?.id || ""}
        onChange={handlePropertyChange}
        placeholder="Selecione um imóvel"
        emptyMessage="Nenhum imóvel encontrado"
        loading={loading}
      />
    </div>
  );
}
