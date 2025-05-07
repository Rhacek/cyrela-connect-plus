
import { LeadCard } from "@/components/broker/dashboard/lead-card";
import { Lead } from "@/types";

interface LeadsListProps {
  leads: Lead[];
}

export function LeadsList({ leads }: LeadsListProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
        <p className="text-sm text-gray-500">
          Tente ajustar os filtros ou adicione novos leads.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} showActions={true} />
      ))}
    </div>
  );
}
