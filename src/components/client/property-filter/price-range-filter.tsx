
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface PriceRangeFilterProps {
  priceRange?: number[];
  onPriceRangeChange?: (value: number[]) => void;
  value?: [number, number];
  onChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

export function PriceRangeFilter({ 
  priceRange = [300000, 2000000], 
  onPriceRangeChange,
  value,
  onChange,
  min = 300000,
  max = 5000000
}: PriceRangeFilterProps) {
  // Use either value/onChange or priceRange/onPriceRangeChange
  const [internalRange, setInternalRange] = useState(value || priceRange);
  
  useEffect(() => {
    if (value) {
      setInternalRange(value);
    }
  }, [value]);
  
  const handleValueChange = (newValue: number[]) => {
    setInternalRange(newValue as [number, number]);
    if (onChange) {
      onChange(newValue as [number, number]);
    }
    if (onPriceRangeChange) {
      onPriceRangeChange(newValue);
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
        min={min}
        max={max}
        step={50000}
        onValueChange={handleValueChange}
        className="my-4"
      />
    </div>
  );
}
