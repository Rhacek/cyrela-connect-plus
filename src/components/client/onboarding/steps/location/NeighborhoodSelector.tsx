
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface NeighborhoodSelectorProps {
  neighborhoods: string[];
  onNeighborhoodsChange: (neighborhoods: string[]) => void;
  availableNeighborhoods: {
    id: string;
    name: string;
  }[];
}

export function NeighborhoodSelector({
  neighborhoods,
  onNeighborhoodsChange,
  availableNeighborhoods
}: NeighborhoodSelectorProps) {
  const toggleNeighborhood = (neighborhood: string) => {
    const newNeighborhoods = [...neighborhoods];
    if (newNeighborhoods.includes(neighborhood)) {
      onNeighborhoodsChange(newNeighborhoods.filter(n => n !== neighborhood));
    } else if (newNeighborhoods.length < 3) {
      onNeighborhoodsChange([...newNeighborhoods, neighborhood]);
    } else {
      toast({
        title: "Limite atingido",
        description: "Você só pode selecionar até 3 bairros",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <Label>Selecione até 3 bairros</Label>
      <div className="grid grid-cols-2 gap-2">
        {availableNeighborhoods.map((neighborhood) => (
          <Button
            key={neighborhood.id}
            type="button"
            variant="outline"
            className={cn(
              neighborhoods.includes(neighborhood.id) && "bg-cyrela-blue text-black"
            )}
            onClick={() => toggleNeighborhood(neighborhood.id)}
            size="sm"
          >
            {neighborhood.name}
          </Button>
        ))}
      </div>
      <div className="mt-2 text-xs text-cyrela-gray-dark">
        {neighborhoods.length}/3 bairros selecionados
      </div>
    </div>
  );
}
