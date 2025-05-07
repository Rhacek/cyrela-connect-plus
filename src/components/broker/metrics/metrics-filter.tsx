
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface MetricsFilterProps {
  timePeriods: { label: string; value: string }[];
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
}

export function MetricsFilter({ timePeriods, selectedPeriod, onPeriodChange }: MetricsFilterProps) {
  return (
    <Card className="mb-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-sm font-medium">Filtrar período</h3>
        
        <div className="w-full max-w-[250px]">
          <Select value={selectedPeriod} onValueChange={onPeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
