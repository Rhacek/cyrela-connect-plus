
import { useState } from "react";
import { Clock, Check, X, CalendarX, User, Mail, Phone } from "lucide-react";
import { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { appointmentsService } from "@/services/appointments.service";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AppointmentItemProps {
  appointment: Appointment;
  onStatusUpdate: () => void;
}

export function AppointmentItem({ appointment, onStatusUpdate }: AppointmentItemProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    setIsUpdating(true);
    const success = await appointmentsService.updateAppointmentStatus(appointment.id, "CONFIRMADA");
    setIsUpdating(false);
    
    if (success) {
      toast.success("Visita confirmada com sucesso");
      onStatusUpdate();
    } else {
      toast.error("Erro ao confirmar a visita");
    }
    setIsConfirmDialogOpen(false);
  };

  const handleCancel = async () => {
    setIsUpdating(true);
    const success = await appointmentsService.updateAppointmentStatus(appointment.id, "CANCELADA");
    setIsUpdating(false);
    
    if (success) {
      toast.success("Visita cancelada com sucesso");
      onStatusUpdate();
    } else {
      toast.error("Erro ao cancelar a visita");
    }
    setIsCancelDialogOpen(false);
  };

  const getStatusStyle = () => {
    switch (appointment.status) {
      case "AGENDADA":
        return "bg-amber-100 text-amber-700";
      case "CONFIRMADA":
        return "bg-green-100 text-green-700";
      case "CANCELADA":
        return "bg-red-100 text-red-700";
      case "CONCLUIDA":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = () => {
    switch (appointment.status) {
      case "AGENDADA":
        return "Agendada";
      case "CONFIRMADA":
        return "Confirmada";
      case "CANCELADA":
        return "Cancelada";
      case "CONCLUIDA":
        return "Concluída";
      default:
        return appointment.status;
    }
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={appointment.id} className="border rounded-lg hover:shadow-sm transition-all">
          <div className="flex items-start p-4">
            <div className="mr-4 flex-shrink-0 flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <AccordionTrigger className="hover:no-underline py-0">
                <div className="text-left">
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-sm text-cyrela-gray-dark">
                    Cliente: {appointment.client}
                  </p>
                </div>
              </AccordionTrigger>
            </div>
            <div className="ml-4 flex-shrink-0 flex flex-col items-end gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle()}`}>
                {getStatusText()}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {appointment.time}
              </span>
            </div>
          </div>
          <AccordionContent className="px-4 pb-4 pt-0">
            <div className="border-t mt-2 pt-2">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Cliente:</span> {appointment.client}
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span> {appointment.clientEmail}
                </div>
                
                {appointment.clientPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Telefone:</span> {appointment.clientPhone}
                  </div>
                )}
                
                {appointment.notes && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Observações:</p>
                    <p className="text-sm text-gray-600">{appointment.notes}</p>
                  </div>
                )}

                {appointment.status === "AGENDADA" && (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setIsConfirmDialogOpen(true)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Confirmar
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => setIsCancelDialogOpen(true)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Confirm Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar visita</DialogTitle>
            <DialogDescription>
              Você está confirmando a visita de {appointment.client} para o dia {appointment.date.toLocaleDateString()} às {appointment.time}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleConfirm}
              disabled={isUpdating}
            >
              {isUpdating ? "Confirmando..." : "Confirmar visita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar visita</DialogTitle>
            <DialogDescription>
              Você está cancelando a visita de {appointment.client} para o dia {appointment.date.toLocaleDateString()} às {appointment.time}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isUpdating}>
              Voltar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancel}
              disabled={isUpdating}
            >
              {isUpdating ? "Cancelando..." : "Cancelar visita"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
