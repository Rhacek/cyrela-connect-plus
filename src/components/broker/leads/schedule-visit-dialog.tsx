import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { appointmentsService } from "@/services/appointments.service";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { addDays, format, isAfter, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { PropertySelect } from "./property-select";

interface ScheduleVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  initialPropertyId?: string;
  onSuccess?: () => void;
}

export function ScheduleVisitDialog({
  open,
  onOpenChange,
  leadId,
  initialPropertyId,
  onSuccess
}: ScheduleVisitDialogProps) {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [time, setTime] = useState<string>("10:00");
  const [notes, setNotes] = useState<string>("");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(initialPropertyId || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setDate(addDays(new Date(), 1));
      setTime("10:00");
      setNotes("");
      setSelectedPropertyId(initialPropertyId || null);
      setIsLoading(false);
      setIsSubmitting(false);
    } else {
      setShowCalendar(false);
    }
  }, [open, initialPropertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !selectedPropertyId || !session?.id) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um imóvel e uma data para a visita",
        variant: "destructive"
      });
      return;
    }
    
    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number);
    const visitDateTime = new Date(date);
    visitDateTime.setHours(hours, minutes);
    
    // Validate date is in the future
    if (isBefore(visitDateTime, new Date())) {
      toast({
        title: "Data inválida",
        description: "A data e hora da visita devem ser no futuro",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await appointmentsService.create({
        clientId: leadId,
        propertyId: selectedPropertyId,
        scheduledAt: visitDateTime.toISOString(),
        notes,
        status: "AGENDADA",
        brokerId: session.id
      });
      
      toast({
        title: "Visita agendada",
        description: "Visita agendada com sucesso!",
      });
      onOpenChange(false);
      
      // Reset form
      setDate(addDays(new Date(), 1));
      setTime("10:00");
      setNotes("");
      setSelectedPropertyId(null);
      
      // Callback
      onSuccess?.();
    } catch (error) {
      console.error("Error scheduling visit:", error);
      toast({
        title: "Erro ao agendar visita",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agendar Visita</DialogTitle>
            <DialogDescription>
              Agende uma visita para o lead selecionado
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Imóvel</Label>
              <PropertySelect
                value={selectedPropertyId}
                onChange={setSelectedPropertyId}
                initialPropertyId={initialPropertyId}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Data da Visita</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                    onClick={toggleCalendar}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                  {showCalendar && (
                    <div className="absolute top-full z-50 mt-1 bg-background border rounded-md shadow-md">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                          setDate(newDate);
                          setShowCalendar(false);
                        }}
                        disabled={(date) => isBefore(date, startOfToday())}
                        initialFocus
                        locale={ptBR}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-none w-full sm:w-24">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full"
                    min="08:00"
                    max="18:00"
                    step="1800"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais sobre a visita"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedPropertyId || !date}
            >
              {isSubmitting ? "Agendando..." : "Agendar Visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
