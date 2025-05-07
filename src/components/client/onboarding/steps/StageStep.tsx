
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StageStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function StageStep({ value, onChange }: StageStepProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value)}
      >
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="pronto" id="pronto" />
          <Label htmlFor="pronto" className="cursor-pointer">Pronto para morar</Label>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="construcao" id="construcao" />
          <Label htmlFor="construcao" className="cursor-pointer">Em construção</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="planta" id="planta" />
          <Label htmlFor="planta" className="cursor-pointer">Na planta</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
