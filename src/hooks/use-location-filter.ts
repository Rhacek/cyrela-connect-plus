
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { zoneNeighborhoods } from "@/components/client/property-filter/filter-data";

export function useLocationFilter(
  initialLocations: string[] = [],
  initialZone: string | null = null,
  maxNeighborhoods: number = 3
) {
  const [selectedZone, setSelectedZone] = useState<string | null>(initialZone);
  const [locations, setLocations] = useState<string[]>(initialLocations);

  // Reset neighborhoods when zone changes
  useEffect(() => {
    if (initialZone !== selectedZone) {
      // Filter out neighborhoods that don't belong to the selected zone
      if (selectedZone) {
        const zoneNeighborhoodIds = zoneNeighborhoods[selectedZone]?.map(n => n.id) || [];
        setLocations(prev => prev.filter(loc => !zoneNeighborhoodIds.includes(loc)));
      }
    }
  }, [selectedZone, initialZone]);

  const handleZoneSelection = (zone: string | null) => {
    setSelectedZone(zone);
    // If zone changes, reset neighborhood selections that belong to zones
    if (zone !== selectedZone) {
      const allZoneNeighborhoods = Object.values(zoneNeighborhoods).flat().map(n => n.id);
      setLocations(prev => prev.filter(loc => !allZoneNeighborhoods.includes(loc)));
    }
  };

  const handleFilterClick = (filterId: string) => {
    setLocations(prev => {
      // Check if the neighborhood is already selected
      if (prev.includes(filterId)) {
        return prev.filter(item => item !== filterId);
      }
      
      // Check if it's a zone neighborhood and we're at the limit
      if (
        selectedZone && 
        zoneNeighborhoods[selectedZone]?.some(n => n.id === filterId) &&
        prev.filter(loc => zoneNeighborhoods[selectedZone]?.some(n => n.id === loc)).length >= maxNeighborhoods
      ) {
        toast.error(`Limite atingido`, {
          description: `Você só pode selecionar até ${maxNeighborhoods} bairros`
        });
        return prev;
      }
      
      return [...prev, filterId];
    });
  };

  return {
    selectedZone,
    locations,
    handleZoneSelection,
    handleFilterClick,
    setLocations
  };
}
