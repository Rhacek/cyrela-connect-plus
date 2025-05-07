
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ObjectiveStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObjectiveStep({ value, onChange }: ObjectiveStepProps) {
  return (
    <div className="space-y-4">
      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value)}
      >
        <div className="flex items-center space-x-2 mb-4">
          <RadioGroupItem value="moradia" id="moradia" />
          <Label htmlFor="moradia" className="cursor-pointer">Moradia</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="investimento" id="investimento" />
          <Label htmlFor="investimento" className="cursor-pointer">Investimento</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
