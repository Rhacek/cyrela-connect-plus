
import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { propertiesService } from "@/services/properties.service";
import { appointmentsService } from "@/services/appointments.service";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "@/types";

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: () => void;
  selectedDate: Date;
}

export function CreateAppointmentDialog({
  isOpen,
  onClose,
  onAppointmentCreated,
  selectedDate
}: CreateAppointmentDialogProps) {
  const { session } = useAuth();
  const brokerId = session?.id;

  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("Visita ao imóvel");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [time, setTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch properties for dropdown selection
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: () => propertiesService.getAllActiveProperties(),
    enabled: isOpen
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brokerId) {
      toast.error("Você precisa estar logado para agendar uma visita");
      return;
    }

    if (!propertyId) {
      toast.error("Selecione um imóvel");
      return;
    }

    if (!clientName) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }

    if (!clientEmail) {
      toast.error("Email do cliente é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await appointmentsService.createAppointment({
        propertyId,
        brokerId,
        title,
        date: selectedDate,
        time,
        notes,
        clientName,
        clientEmail,
        clientPhone
      });

      if (result.success) {
        onAppointmentCreated();
        resetForm();
      } else {
        toast.error(`Erro ao criar agendamento: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao criar agendamento: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPropertyId("");
    setTitle("Visita ao imóvel");
    setClientName("");
    setClientEmail("");
    setClientPhone("");
    setTime("14:00");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agendar nova visita</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para agendar uma nova visita para o dia {format(selectedDate, "dd/MM/yyyy")}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Imóvel</Label>
              {isLoadingProperties ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger id="property">
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property: Property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  disabled
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Horário</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="clientName">Nome do cliente</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Email do cliente</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientPhone">Telefone do cliente</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações adicionais sobre a visita..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || isLoadingProperties}
            >
              {isSubmitting ? "Agendando..." : "Agendar visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
