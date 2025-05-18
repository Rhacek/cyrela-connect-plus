import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { ScheduleVisitDialog } from "./schedule-visit-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ScheduleVisitButtonProps {
  propertyId: string;
  brokerId?: string | null;
}

export function ScheduleVisitButton({ propertyId, brokerId }: ScheduleVisitButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    if (brokerId) {
      // If we have a broker ID, open the scheduling dialog
      setDialogOpen(true);
    } else {
      // Otherwise, navigate to the onboarding page to get a broker
      navigate('/client/onboarding');
    }
  };
  
  return (
    <>
      <Button 
        className="w-full" 
        onClick={handleButtonClick}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agendar visita
      </Button>
      
      {brokerId && (
        <ScheduleVisitDialog 
          open={dialogOpen} 
          onOpenChange={setDialogOpen}
          propertyId={propertyId}
          brokerId={brokerId}
        />
      )}
    </>
  );
}
