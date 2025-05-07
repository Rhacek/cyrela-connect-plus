
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationStepProps {
  city: string;
  zone: string;
  neighborhoods: string[];
  onCityChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onNeighborhoodsChange: (neighborhoods: string[]) => void;
}

export function LocationStep({ 
  city, 
  zone, 
  neighborhoods, 
  onCityChange, 
  onZoneChange, 
  onNeighborhoodsChange 
}: LocationStepProps) {
  const toggleNeighborhood = (neighborhood: string) => {
    const newNeighborhoods = [...neighborhoods];
    if (newNeighborhoods.includes(neighborhood)) {
      onNeighborhoodsChange(newNeighborhoods.filter(n => n !== neighborhood));
    } else if (newNeighborhoods.length < 3) {
      onNeighborhoodsChange([...newNeighborhoods, neighborhood]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Select
          value={city}
          onValueChange={onCityChange}
        >
          <SelectTrigger id="city" className="cyrela-input">
            <SelectValue placeholder="Selecione uma cidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saopaulo">São Paulo</SelectItem>
            <SelectItem value="santos">Santos</SelectItem>
            <SelectItem value="cotia">Cotia</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {city && (
        <div className="space-y-2 animate-fade-in">
          <Label htmlFor="zone">Zona</Label>
          <Select
            value={zone}
            onValueChange={onZoneChange}
          >
            <SelectTrigger id="zone" className="cyrela-input">
              <SelectValue placeholder="Selecione uma zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zonasul">Zona Sul</SelectItem>
              <SelectItem value="zonanorte">Zona Norte</SelectItem>
              <SelectItem value="zonaleste">Zona Leste</SelectItem>
              <SelectItem value="zonaoeste">Zona Oeste</SelectItem>
              <SelectItem value="abc">ABC Paulista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {zone === "zonasul" && (
        <div className="space-y-2 animate-fade-in">
          <Label>Selecione até 3 bairros</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              className={cn(
                neighborhoods.includes("campobelo") && "bg-cyrela-blue text-white"
              )}
              onClick={() => toggleNeighborhood("campobelo")}
              size="sm"
            >
              Campo Belo
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className={cn(
                neighborhoods.includes("moema") && "bg-cyrela-blue text-white"
              )}
              onClick={() => toggleNeighborhood("moema")}
              size="sm"
            >
              Moema
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className={cn(
                neighborhoods.includes("ibirapuera") && "bg-cyrela-blue text-white"
              )}
              onClick={() => toggleNeighborhood("ibirapuera")}
              size="sm"
            >
              Ibirapuera
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className={cn(
                neighborhoods.includes("morumbi") && "bg-cyrela-blue text-white"
              )}
              onClick={() => toggleNeighborhood("morumbi")}
              size="sm"
            >
              Morumbi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
