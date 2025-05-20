import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types";
import { useState } from "react";
import { Phone, Mail, Calendar, MoreHorizontal, Tag } from "lucide-react";
import { ScheduleVisitDialog } from "../leads/schedule-visit-dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leads.service";

interface LeadCardProps {
  lead: Lead;
  onUpdate?: () => void;
}

export function LeadCard({ lead, onUpdate }: LeadCardProps) {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Funções para lidar com os botões de ação
  const handlePhoneCall = () => {
    if (lead.phone) {
      window.location.href = `tel:${lead.phone}`;
      
      // Registrar contato
      leadsService.registerContact(lead.id, "PHONE_CALL")
        .then(() => {
          toast({
            title: "Contato registrado",
            description: "Ligação registrada com sucesso"
          });
          onUpdate?.();
        })
        .catch(error => {
          console.error("Error registering contact:", error);
        });
    } else {
      toast({
        title: "Telefone não disponível",
        description: "Este lead não possui telefone cadastrado",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = () => {
    if (lead.email) {
      window.location.href = `mailto:${lead.email}`;
      
      // Registrar contato
      leadsService.registerContact(lead.id, "EMAIL")
        .then(() => {
          toast({
            title: "Contato registrado",
            description: "Email registrado com sucesso"
          });
          onUpdate?.();
        })
        .catch(error => {
          console.error("Error registering contact:", error);
        });
    } else {
      toast({
        title: "Email não disponível",
        description: "Este lead não possui email cadastrado",
        variant: "destructive"
      });
    }
  };

  const handleScheduleVisit = () => {
    setScheduleDialogOpen(true);
  };

  const handleScheduleSuccess = () => {
    onUpdate?.();
  };

  const updateLeadStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      await leadsService.updateStatus(lead.id, status);
      toast({
        title: "Status atualizado",
        description: `Lead marcado como ${status.toLowerCase()}`
      });
      onUpdate?.();
    } catch (error) {
      console.error("Error updating lead status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Função para determinar a cor do badge baseado no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'QUENTE':
        return 'destructive';
      case 'MORNO':
        return 'default';
      case 'FRIO':
        return 'secondary';
      case 'VISITA':
        return 'outline';
      case 'DESQUALIFICADO':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{lead.name}</CardTitle>
              <CardDescription>
                {lead.email && <div>{lead.email}</div>}
                {lead.phone && <div>{lead.phone}</div>}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {lead.status && (
                <Badge variant={getStatusBadgeVariant(lead.status)}>
                  {lead.status}
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isUpdating}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateLeadStatus("FRIO")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Marcar como Frio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateLeadStatus("MORNO")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Marcar como Morno
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateLeadStatus("QUENTE")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Marcar como Quente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateLeadStatus("VISITA")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Marcar como Visita
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateLeadStatus("DESQUALIFICADO")}>
                    <Tag className="mr-2 h-4 w-4" />
                    Desqualificar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p><strong>Interesse:</strong> {lead.interest || "Não informado"}</p>
            <p><strong>Orçamento:</strong> {lead.budget ? 
              lead.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 
              "Não informado"}
            </p>
            <p><strong>Criado em:</strong> {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</p>
            {lead.lastContact && (
              <p><strong>Último contato:</strong> {new Date(lead.lastContact).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePhoneCall}>
              <Phone className="mr-2 h-4 w-4" />
              Ligar
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
          <Button size="sm" onClick={handleScheduleVisit}>
            <Calendar className="mr-2 h-4 w-4" />
            Agendar Visita
          </Button>
        </CardFooter>
      </Card>

      <ScheduleVisitDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        leadId={lead.id}
        onSuccess={handleScheduleSuccess}
      />
    </>
  );
}
