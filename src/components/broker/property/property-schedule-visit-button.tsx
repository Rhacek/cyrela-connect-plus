import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { ScheduleVisitDialog } from "../leads/schedule-visit-dialog";

interface PropertyScheduleVisitButtonProps {
  propertyId: string;
  className?: string;
  variant?: "default" | "outline" | "secondary";
}

export function PropertyScheduleVisitButton({
  propertyId,
  className,
  variant = "default"
}: PropertyScheduleVisitButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setDialogOpen(true)} 
        className={className}
        variant={variant}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Agendar Visita
      </Button>

      <ScheduleVisitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        leadId=""
        initialPropertyId={propertyId}
      />
    </>
  );
}
