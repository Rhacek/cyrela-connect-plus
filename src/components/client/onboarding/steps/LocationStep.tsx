
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NeighborhoodSelector } from "./location/NeighborhoodSelector";
import { zoneNeighborhoods } from "@/components/client/property-filter/filter-data";

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
      
      {zone && zoneNeighborhoods[zone] && (
        <NeighborhoodSelector 
          neighborhoods={neighborhoods}
          onNeighborhoodsChange={onNeighborhoodsChange}
          availableNeighborhoods={zoneNeighborhoods[zone].map(n => ({ id: n.id, name: n.label }))}
        />
      )}
    </div>
  );
}
