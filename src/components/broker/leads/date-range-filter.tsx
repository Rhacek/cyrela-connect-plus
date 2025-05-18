
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  onClear: () => void;
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClear
}: DateRangeFilterProps) {
  const [fromPopoverOpen, setFromPopoverOpen] = useState(false);
  const [toPopoverOpen, setToPopoverOpen] = useState(false);
  
  // Format date for display
  const formatDateForDisplay = (date: Date | undefined) => {
    if (!date) return "Selecionar";
    return format(date, "dd/MM/yyyy");
  };
  
  // Close popover when date is selected
  useEffect(() => {
    if (fromDate) setFromPopoverOpen(false);
  }, [fromDate]);
  
  useEffect(() => {
    if (toDate) setToPopoverOpen(false);
  }, [toDate]);
  
  // Get button label
  const buttonLabel = () => {
    if (fromDate && toDate) {
      return `${formatDateForDisplay(fromDate)} - ${formatDateForDisplay(toDate)}`;
    } else if (fromDate) {
      return `Após ${formatDateForDisplay(fromDate)}`;
    } else if (toDate) {
      return `Até ${formatDateForDisplay(toDate)}`;
    }
    return "Data de criação";
  };
  
  // Clear date filters
  const handleClear = () => {
    onClear();
    setFromPopoverOpen(false);
    setToPopoverOpen(false);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="relative">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-cyrela-gray-lighter min-w-40"
        >
          <CalendarIcon size={16} />
          <span className="text-sm truncate">{buttonLabel()}</span>
        </Button>
        <div className="absolute top-full mt-2 z-50 bg-white rounded-md shadow-md border border-gray-200 p-3 flex flex-col w-[320px]">
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-medium">Filtrar por data</h3>
            {(fromDate || toDate) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs text-gray-500" 
                onClick={handleClear}
              >
                Limpar
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Popover open={fromPopoverOpen} onOpenChange={setFromPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <span className="text-xs">De: {formatDateForDisplay(fromDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={onFromDateChange}
                  initialFocus
                  toDate={toDate || new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Popover open={toPopoverOpen} onOpenChange={setToPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <span className="text-xs">Até: {formatDateForDisplay(toDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={onToDateChange}
                  initialFocus
                  fromDate={fromDate}
                  toDate={new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
