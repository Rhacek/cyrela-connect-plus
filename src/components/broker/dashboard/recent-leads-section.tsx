
import { Button } from "@/components/ui/button";
import { LeadCard } from "@/components/broker/dashboard/lead-card";
import { Lead } from "@/types";
import { cn } from "@/lib/utils";

interface RecentLeadsSectionProps {
  leads: Lead[];
  className?: string;
}

export function RecentLeadsSection({ leads, className }: RecentLeadsSectionProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg p-5 shadow-sm border border-cyrela-gray-lighter flex flex-col h-full",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Leads recentes</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-cyrela-blue"
          onClick={() => window.location.href = "/broker/leads"}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="grid gap-4 flex-1 overflow-auto">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            className="h-full w-full"
          />
        ))}
      </div>
    </div>
  );
}
