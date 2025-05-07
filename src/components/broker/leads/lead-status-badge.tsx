
import { LeadStatus } from "@/types";
import { cn } from "@/lib/utils";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  showLabel?: boolean;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function LeadStatusBadge({ 
  status, 
  showLabel = true, 
  size = "md",
  className 
}: LeadStatusBadgeProps) {
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

  const getDotSize = () => {
    switch (size) {
      case "xs":
        return "w-2 h-2";
      case "sm":
        return "w-2.5 h-2.5";
      case "md":
        return "w-3 h-3";
      default:
        return "w-2.5 h-2.5";
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center",
      showLabel ? "px-2 py-1 rounded-full text-xs font-medium" : "",
      getStatusColor(status),
      className
    )}>
      <span className={cn(
        "rounded-full mr-1.5", 
        getDotSize(),
        !showLabel && "mr-0"
      )} />
      {showLabel && getStatusLabel(status)}
    </span>
  );
}
