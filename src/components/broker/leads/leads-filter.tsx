
import { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, CheckSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { DateRangeFilter } from "./date-range-filter";
import { LeadStatus } from "@/types";
import { LeadStatusBadge } from "./lead-status-badge";
import { Input } from "@/components/ui/input";

interface LeadsFilterProps {
  searchTerm: string;
  statusFilter: LeadStatus | "ALL";
  fromDate: Date | undefined;
  toDate: Date | undefined;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: LeadStatus | "ALL") => void;
  onFromDateChange: (date: Date | undefined) => void;
  onToDateChange: (date: Date | undefined) => void;
  onClearDateFilters: () => void;
}

export function LeadsFilter({ 
  searchTerm, 
  statusFilter, 
  fromDate,
  toDate,
  onSearchChange, 
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onClearDateFilters
}: LeadsFilterProps) {
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const statuses: Array<{ value: LeadStatus | "ALL", label: string }> = [
    { value: "ALL", label: "Todos" },
    { value: LeadStatus.NEW, label: "Novos" },
    { value: LeadStatus.CONTACTED, label: "Contatados" },
    { value: LeadStatus.INTERESTED, label: "Interessados" },
    { value: LeadStatus.SCHEDULED, label: "Agendados" },
    { value: LeadStatus.VISITED, label: "Visitados" },
    { value: LeadStatus.CONVERTED, label: "Convertidos" },
    { value: LeadStatus.LOST, label: "Perdidos" }
  ];
  
  const clearSearch = () => {
    onSearchChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const hasDateFilter = fromDate || toDate;
  
  // Get the active filters count (excluding ALL status which is no filter)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (statusFilter !== "ALL") count++;
    if (hasDateFilter) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-4 sm:p-5 mb-6">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={18} />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-10 py-2 rounded-md border border-cyrela-gray-lighter focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray hover:text-cyrela-gray-dark"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <DateRangeFilter
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={onFromDateChange}
          onToDateChange={onToDateChange}
          onClear={onClearDateFilters}
        />
        
        <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="sm:w-auto w-full flex items-center gap-2 border-cyrela-gray-lighter"
            >
              <Filter size={16} />
              <span>Filtros</span>
              {getActiveFiltersCount() > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyrela-blue text-[10px] font-medium text-white">
                  {getActiveFiltersCount()}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Filtros Avançados</h3>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-cyrela-gray-dark">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <div key={status.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.value}`}
                        checked={statusFilter === status.value}
                        onCheckedChange={() => {
                          onStatusChange(status.value);
                        }}
                      />
                      <label
                        htmlFor={`status-${status.value}`}
                        className="text-sm font-medium flex items-center cursor-pointer"
                      >
                        {status.value !== "ALL" && (
                          <span className="mr-1">
                            <LeadStatusBadge status={status.value} showLabel={false} size="xs" />
                          </span>
                        )}
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
