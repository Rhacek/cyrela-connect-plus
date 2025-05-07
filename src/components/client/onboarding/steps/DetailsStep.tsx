
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DetailsStepProps {
  bedrooms: string;
  budget: string;
  onBedroomsChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
}

export function DetailsStep({ 
  bedrooms, 
  budget, 
  onBedroomsChange, 
  onBudgetChange 
}: DetailsStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bedrooms">Número de dormitórios</Label>
        <Select
          value={bedrooms}
          onValueChange={onBedroomsChange}
        >
          <SelectTrigger id="bedrooms" className="cyrela-input">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 dormitório</SelectItem>
            <SelectItem value="2">2 dormitórios</SelectItem>
            <SelectItem value="3">3 dormitórios</SelectItem>
            <SelectItem value="4+">4+ dormitórios</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget">Faixa de valor</Label>
        <Select
          value={budget}
          onValueChange={onBudgetChange}
        >
          <SelectTrigger id="budget" className="cyrela-input">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500-800">R$ 500 mil - R$ 800 mil</SelectItem>
            <SelectItem value="800-1200">R$ 800 mil - R$ 1.2 milhões</SelectItem>
            <SelectItem value="1200-2000">R$ 1.2 milhões - R$ 2 milhões</SelectItem>
            <SelectItem value="2000+">Acima de R$ 2 milhões</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
