
import { useState } from "react";
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";
import { CreateLeadDialog } from "@/components/broker/leads/create-lead-dialog";

interface LeadsHeaderProps {
  onLeadCreated: () => void;
}

export function LeadsHeader({ onLeadCreated }: LeadsHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleAddLeadClick = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <>
      <DashboardHeader 
        title="Leads"
        description="Gerencie seus leads e acompanhe o progresso de cada um deles."
        buttonLabel="Novo Lead"
        onButtonClick={handleAddLeadClick}
      />
      
      <CreateLeadDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onLeadCreated={onLeadCreated}
      />
    </>
  );
}
