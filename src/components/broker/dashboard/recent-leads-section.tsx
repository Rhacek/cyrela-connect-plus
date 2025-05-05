
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
      "cyrela-card flex flex-col h-full animate-fade-in p-3 sm:p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold font-poppins truncate">Leads recentes</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-primary border-primary hover:bg-cyrela-gray-lighter font-inter shrink-0 ml-2 text-xs sm:text-sm py-1 px-2 h-auto"
          onClick={() => window.location.href = "/broker/leads"}
        >
          Ver todos
        </Button>
      </div>
      
      <div className="grid gap-2 sm:gap-4 flex-1 overflow-auto max-h-[calc(100%-3rem)]">
        {leads.length > 0 ? (
          leads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              className="h-full w-full hover-scale transition-all duration-200"
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-cyrela-gray-dark p-2 sm:p-4">
            <p className="text-center font-inter break-words text-xs sm:text-sm">Nenhum lead recente encontrado.</p>
            <Button 
              className="mt-3 sm:mt-4 cyrela-button-primary text-xs sm:text-sm py-1.5 px-3 h-auto"
              onClick={() => window.location.href = "/broker/leads/new"}
            >
              Cadastrar novo lead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
