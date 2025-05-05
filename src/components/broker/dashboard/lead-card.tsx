
import { User, Phone, Mail, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead, LeadStatus } from "@/types";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  showActions?: boolean;
  className?: string;
}

export function LeadCard({ lead, showActions = true, className }: LeadCardProps) {
  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case LeadStatus.CONTACTED:
        return "bg-indigo-100 text-indigo-800";
      case LeadStatus.INTERESTED:
        return "bg-purple-100 text-purple-800";
      case LeadStatus.SCHEDULED:
        return "bg-yellow-100 text-yellow-800";
      case LeadStatus.VISITED:
        return "bg-green-100 text-green-800";
      case LeadStatus.CONVERTED:
        return "bg-living-gold bg-opacity-20 text-living-gold";
      case LeadStatus.LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return "Novo";
      case LeadStatus.CONTACTED:
        return "Contatado";
      case LeadStatus.INTERESTED:
        return "Interessado";
      case LeadStatus.SCHEDULED:
        return "Agendado";
      case LeadStatus.VISITED:
        return "Visitado";
      case LeadStatus.CONVERTED:
        return "Convertido";
      case LeadStatus.LOST:
        return "Perdido";
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-cyrela-gray-lighter flex flex-col",
      lead.isManual && "border-l-4 border-l-cyrela-blue",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyrela-gray-lighter flex items-center justify-center shrink-0">
            <User size={16} className="sm:hidden text-cyrela-gray-dark" />
            <User size={20} className="hidden sm:block text-cyrela-gray-dark" />
          </div>
          <div className="ml-2 sm:ml-3 min-w-0 flex-1 overflow-hidden">
            <h3 className="text-sm sm:text-base font-medium truncate">{lead.name}</h3>
            <p className="text-xs sm:text-sm text-cyrela-gray-dark truncate">{lead.source}</p>
          </div>
        </div>
        
        <Badge className={cn(
          "px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-normal whitespace-nowrap ml-1 sm:ml-2 shrink-0",
          getStatusColor(lead.status)
        )}>
          {getStatusLabel(lead.status)}
        </Badge>
      </div>
      
      <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
        <div className="flex items-center text-xs sm:text-sm">
          <Phone size={14} className="mr-1.5 sm:mr-2 text-cyrela-gray-dark shrink-0" />
          <span className="truncate">{lead.phone}</span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm">
          <Mail size={14} className="mr-1.5 sm:mr-2 text-cyrela-gray-dark shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        
        <div className="flex items-center text-xs sm:text-sm flex-wrap">
          <div className="flex items-center mr-3 sm:mr-4 mb-1">
            <Calendar size={14} className="mr-1.5 sm:mr-2 text-cyrela-gray-dark shrink-0" />
            <span>{formatDate(lead.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1.5 sm:mr-2 text-cyrela-gray-dark shrink-0" />
            <span>{formatTime(lead.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {lead.notes && (
        <div className="mt-2 sm:mt-3 p-1.5 sm:p-2 bg-cyrela-gray-lightest rounded text-xs sm:text-sm">
          <p className="text-cyrela-gray-dark line-clamp-2">{lead.notes}</p>
        </div>
      )}
      
      {showActions && (
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-2">
          <Button variant="outline" size="sm" className="bg-white text-xs px-2 py-1 h-auto">
            <Phone size={14} className="mr-1 sm:mr-2 shrink-0" />
            <span className="truncate">Ligar</span>
          </Button>
          
          <Button variant="outline" size="sm" className="bg-white text-xs px-2 py-1 h-auto">
            <Mail size={14} className="mr-1 sm:mr-2 shrink-0" />
            <span className="truncate">Email</span>
          </Button>
          
          <Button className="ml-auto bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white shrink-0 text-xs px-2 py-1 h-auto" size="sm">
            Atualizar
          </Button>
        </div>
      )}
    </div>
  );
}
