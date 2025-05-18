import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarClock, MapPin } from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import { useAuth } from "@/context/auth-context";
import { appointmentsService } from "@/services/appointments.service";
import { incrementPerformanceMetric } from "@/services/performance/performance-mutation.service";
import { toast } from "@/hooks/use-toast";
import { PropertySelect } from "./property-select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ScheduleVisitDialogProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ScheduleVisitFormValues {
  date: Date;
  time: string;
  propertyId: string;
  notes?: string;
}

export function ScheduleVisitDialog({ lead, isOpen, onClose, onSuccess }: ScheduleVisitDialogProps) {
  const { session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleVisitFormValues>({
    defaultValues: {
      date: new Date(),
      time: "10:00",
      propertyId: lead.propertyId || "",
      notes: ""
    }
  });

  const handleSubmit = async (values: ScheduleVisitFormValues) => {
    if (!session?.id) {
      toast.error("Sessão expirada. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create appointment
      const appointmentData = {
        propertyId: values.propertyId,
        brokerId: session.id,
        clientId: undefined, // No client account for this lead
        title: `Visita com ${lead.name}`,
        date: values.date,
        time: values.time,
        notes: values.notes,
        clientName: lead.name,
        clientEmail: lead.email,
        clientPhone: lead.phone
      };

      const result = await appointmentsService.createAppointment(appointmentData);

      if (!result.success) {
        throw new Error(result.error || "Falha ao agendar visita");
      }

      // Update lead status if it's in NEW or CONTACTED state
      if (lead.status === "NEW" || lead.status === "CONTACTED") {
        await updateLeadStatus(lead.id, LeadStatus.SCHEDULED);
      }

      // Increment performance metric
      await incrementPerformanceMetric(session.id, "schedules");

      toast.success("Visita agendada com sucesso!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error("Error scheduling visit:", error);
      toast.error("Erro ao agendar visita. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      const { leadsService } = await import("@/services/leads.service");
      await leadsService.updateLeadStatus(leadId, status);
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Agendar Visita com {lead.name}
          </DialogTitle>
          <DialogDescription>
            Agende uma visita a um imóvel com este lead.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyId"
              rules={{ required: "Selecione um imóvel" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel</FormLabel>
                  <FormControl>
                    <PropertySelect
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione um imóvel"
                      icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                rules={{ required: "Selecione uma data" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                rules={{ required: "Informe um horário" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione informações importantes sobre esta visita"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Agendando..." : "Agendar Visita"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
