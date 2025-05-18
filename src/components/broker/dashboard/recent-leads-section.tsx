
import { useState } from "react";
import { LeadCard } from "./lead-card";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";

interface RecentLeadsSectionProps {
  leads: Lead[];
  isLoading?: boolean;
  onLeadUpdated?: () => void;
  className?: string; // Added className prop
}

export function RecentLeadsSection({ 
  leads, 
  isLoading, 
  onLeadUpdated,
  className 
}: RecentLeadsSectionProps) {
  const [expandedLeads, setExpandedLeads] = useState<boolean>(false);
  
  // Show only first 3 leads by default
  const displayCount = expandedLeads ? leads.length : Math.min(3, leads.length);
  const displayedLeads = leads.slice(0, displayCount);
  
  if (isLoading) {
    return (
      <div className={cn("animate-pulse mt-4 space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (leads.length === 0) {
    return (
      <div className={cn("mt-4 p-4 border border-dashed border-gray-300 rounded-lg", className)}>
        <p className="text-center text-gray-500">Nenhum lead recente encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className={cn("mt-4 space-y-4", className)}>
      {displayedLeads.map((lead) => (
        <LeadCard 
          key={lead.id} 
          lead={lead} 
          showActions={true}
          onLeadUpdated={onLeadUpdated}
        />
      ))}
      
      {leads.length > 3 && (
        <button
          onClick={() => setExpandedLeads(!expandedLeads)}
          className="w-full py-2 text-sm text-cyrela-blue hover:underline"
        >
          {expandedLeads ? "Ver menos" : `Ver mais ${leads.length - 3} leads`}
        </button>
      )}
    </div>
  );
}
