
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";

interface LeadsHeaderProps {
  onAddLeadClick: () => void;
}

export function LeadsHeader({ onAddLeadClick }: LeadsHeaderProps) {
  return (
    <DashboardHeader 
      title="Leads"
      description="Gerencie seus leads e acompanhe o progresso de cada um deles."
      buttonLabel="Novo Lead"
      onButtonClick={onAddLeadClick}
    />
  );
}
