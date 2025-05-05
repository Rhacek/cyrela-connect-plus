
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  priceRange: number[];
  onPriceRangeChange: (value: number[]) => void;
}

export function PriceRangeFilter({ priceRange, onPriceRangeChange }: PriceRangeFilterProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };
  
  return (
    <div className="px-1 pt-2 pb-6">
      <div className="flex justify-between text-xs text-cyrela-gray-dark mb-4">
        <span>{formatCurrency(priceRange[0])}</span>
        <span>{formatCurrency(priceRange[1])}</span>
      </div>
      <Slider
        defaultValue={priceRange}
        min={300000}
        max={5000000}
        step={50000}
        onValueChange={(value) => onPriceRangeChange(value as number[])}
        className="my-4"
      />
    </div>
  );
}
