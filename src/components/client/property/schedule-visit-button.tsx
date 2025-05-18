
import { useState } from "react";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduleVisitDialog } from "./schedule-visit-dialog";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ScheduleVisitButtonProps {
  propertyId: string;
  propertyTitle: string;
  brokerId: string;
  className?: string;
}

export function ScheduleVisitButton({
  propertyId,
  propertyTitle,
  brokerId,
  className
}: ScheduleVisitButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!session) {
      toast.warning("Você precisa estar logado para agendar uma visita", {
        action: {
          altText: "Fazer login",
          onClick: () => navigate("/auth")
        }
      });
      return;
    }
    
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        className={className}
        size="lg"
      >
        <CalendarClock className="mr-2 h-5 w-5" />
        Agendar visita
      </Button>

      <ScheduleVisitDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        brokerId={brokerId}
      />
    </>
  );
}
