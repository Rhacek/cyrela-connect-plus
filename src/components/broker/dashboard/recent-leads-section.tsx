
import { Button } from "@/components/ui/button";
import { LeadCard } from "@/components/broker/dashboard/lead-card";
import { Lead } from "@/types";

interface RecentLeadsSectionProps {
  leads: Lead[];
}

export function RecentLeadsSection({ leads }: RecentLeadsSectionProps) {
  return (
    <div>
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
      
      <div className="grid gap-4">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            className="h-full"
          />
        ))}
      </div>
    </div>
  );
}
