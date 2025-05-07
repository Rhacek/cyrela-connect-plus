
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadStatus } from "@/types";
import { LeadStatusBadge } from "./lead-status-badge";

interface LeadsFilterProps {
  searchTerm: string;
  statusFilter: LeadStatus | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (status: LeadStatus | "ALL") => void;
}

export function LeadsFilter({ 
  searchTerm, 
  statusFilter, 
  onSearchChange, 
  onStatusChange 
}: LeadsFilterProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-4 sm:p-5 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-cyrela-gray-lighter focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="sm:w-auto w-full flex items-center gap-2 border-cyrela-gray-lighter"
        >
          <Filter size={16} />
          <span>Filtros</span>
        </Button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === status.value 
                ? "bg-cyrela-blue text-white" 
                : "bg-cyrela-gray-lighter text-cyrela-gray-dark hover:bg-cyrela-gray-light"
            }`}
          >
            {status.value !== "ALL" && (
              <span className="mr-1.5">
                <LeadStatusBadge status={status.value} showLabel={false} size="xs" />
              </span>
            )}
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
