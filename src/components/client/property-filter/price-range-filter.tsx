
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface PriceRangeFilterProps {
  priceRange?: number[];
  onPriceRangeChange?: (value: number[]) => void;
}

export function PriceRangeFilter({ 
  priceRange = [300000, 2000000], 
  onPriceRangeChange 
}: PriceRangeFilterProps) {
  const [internalRange, setInternalRange] = useState(priceRange);
  
  const handleValueChange = (value: number[]) => {
    setInternalRange(value);
    if (onPriceRangeChange) {
      onPriceRangeChange(value);
    }
  };

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
        <span>{formatCurrency(internalRange[0])}</span>
        <span>{formatCurrency(internalRange[1])}</span>
      </div>
      <Slider
        defaultValue={internalRange}
        min={300000}
        max={5000000}
        step={50000}
        onValueChange={handleValueChange}
        className="my-4"
      />
    </div>
  );
}
