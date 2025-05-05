
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
      "bg-white rounded-lg p-5 shadow-sm border border-cyrela-gray-lighter flex flex-col",
      lead.isManual && "border-l-4 border-l-cyrela-blue",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-cyrela-gray-lighter flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-cyrela-gray-dark" />
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <h3 className="font-medium truncate">{lead.name}</h3>
            <p className="text-sm text-cyrela-gray-dark truncate">{lead.source}</p>
          </div>
        </div>
        
        <Badge className={cn(
          "px-2 py-1 font-normal whitespace-nowrap ml-2 flex-shrink-0",
          getStatusColor(lead.status)
        )}>
          {getStatusLabel(lead.status)}
        </Badge>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm">
          <Phone size={16} className="mr-2 text-cyrela-gray-dark flex-shrink-0" />
          <span className="truncate">{lead.phone}</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Mail size={16} className="mr-2 text-cyrela-gray-dark flex-shrink-0" />
          <span className="truncate">{lead.email}</span>
        </div>
        
        <div className="flex items-center text-sm flex-wrap">
          <div className="flex items-center mr-4 mb-1">
            <Calendar size={16} className="mr-2 text-cyrela-gray-dark flex-shrink-0" />
            <span>{formatDate(lead.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-cyrela-gray-dark flex-shrink-0" />
            <span>{formatTime(lead.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {lead.notes && (
        <div className="mt-3 p-3 bg-cyrela-gray-lightest rounded text-sm">
          <p className="text-cyrela-gray-dark line-clamp-2">{lead.notes}</p>
        </div>
      )}
      
      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Phone size={16} className="mr-2" />
            Ligar
          </Button>
          
          <Button variant="outline" size="sm" className="bg-white">
            <Mail size={16} className="mr-2" />
            Email
          </Button>
          
          <Button className="ml-auto bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white" size="sm">
            Atualizar status
          </Button>
        </div>
      )}
    </div>
  );
}
