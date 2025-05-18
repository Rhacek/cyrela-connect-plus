
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ScheduleVisitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  brokerId: string;
}

export function ScheduleVisitDialog({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  brokerId
}: ScheduleVisitDialogProps) {
  const { session } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState(session?.user_metadata?.name || "");
  const [email, setEmail] = useState(session?.email || "");
  const [phone, setPhone] = useState(session?.user_metadata?.phone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error("Selecione uma data para a visita");
      return;
    }

    if (!name) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!email) {
      toast.error("Email é obrigatório");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await appointmentsService.createAppointment({
        propertyId,
        brokerId,
        clientId: session?.id,
        title: `Visita: ${propertyTitle}`,
        date,
        time,
        notes,
        clientName: name,
        clientEmail: email,
        clientPhone: phone
      });

      if (result.success) {
        toast.success("Visita agendada com sucesso! O corretor entrará em contato para confirmar.");
        resetForm();
        onClose();
      } else {
        toast.error(`Erro ao agendar visita: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao agendar visita: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setTime("14:00");
    setNotes("");
  };

  // Only allow dates starting from tomorrow
  const disabledDays = {
    before: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agendar visita</DialogTitle>
            <DialogDescription>
              Agende uma visita para conhecer este imóvel. O corretor entrará em contato para confirmar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Imóvel</Label>
              <Input
                id="property"
                value={propertyTitle}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Data da visita</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: ptBR })
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={disabledDays}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="time">Horário preferido</Label>
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
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Seu email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Seu telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Horários alternativos, perguntas sobre o imóvel, etc."
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
              disabled={isSubmitting || !date}
            >
              {isSubmitting ? "Agendando..." : "Agendar visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
