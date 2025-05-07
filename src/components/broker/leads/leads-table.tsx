
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LeadStatusBadge } from "@/components/broker/leads/lead-status-badge";
import { Lead } from "@/types";
import { Info, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lead encontrado</h3>
        <p className="text-sm text-gray-500">
          Tente ajustar os filtros ou adicione novos leads.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[140px] hidden md:table-cell">Telefone</TableHead>
            <TableHead className="w-[120px] hidden lg:table-cell">Origem</TableHead>
            <TableHead className="w-[100px] hidden md:table-cell">Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className={cn(lead.isManual && "border-l-4 border-l-cyrela-blue")}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="truncate max-w-[200px]">{lead.name}</span>
                  <span className="text-xs text-cyrela-gray-dark md:hidden truncate">{lead.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <LeadStatusBadge status={lead.status} />
              </TableCell>
              <TableCell className="hidden md:table-cell">{lead.phone}</TableCell>
              <TableCell className="hidden lg:table-cell">{lead.source}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(lead.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Phone size={14} />
                    <span className="sr-only">Ligar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Mail size={14} />
                    <span className="sr-only">Email</span>
                  </Button>
                  <Popover 
                    open={openPopoverId === lead.id} 
                    onOpenChange={(open) => setOpenPopoverId(open ? lead.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Info size={14} />
                        <span className="sr-only">Detalhes</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-base">{lead.name}</h3>
                          <p className="text-sm text-cyrela-gray-dark">{lead.email}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Telefone</div>
                            <div>{lead.phone}</div>
                          </div>
                          <div>
                            <div className="font-medium">Origem</div>
                            <div>{lead.source}</div>
                          </div>
                          <div>
                            <div className="font-medium">Criado em</div>
                            <div>{formatDate(lead.createdAt)}</div>
                          </div>
                          <div>
                            <div className="font-medium">Horário</div>
                            <div>{formatTime(lead.createdAt)}</div>
                          </div>
                        </div>
                        
                        {lead.budget && (
                          <div>
                            <div className="font-medium text-sm">Orçamento</div>
                            <div className="text-sm">
                              R$ {lead.budget.toLocaleString('pt-BR')}
                            </div>
                          </div>
                        )}
                        
                        {lead.desiredLocation && (
                          <div>
                            <div className="font-medium text-sm">Localização desejada</div>
                            <div className="text-sm">{lead.desiredLocation}</div>
                          </div>
                        )}
                        
                        {(lead.preferredBedrooms || lead.preferredBathrooms) && (
                          <div>
                            <div className="font-medium text-sm">Preferências</div>
                            <div className="text-sm">
                              {lead.preferredBedrooms && `${lead.preferredBedrooms} quarto(s)`}
                              {lead.preferredBedrooms && lead.preferredBathrooms && ", "}
                              {lead.preferredBathrooms && `${lead.preferredBathrooms} banheiro(s)`}
                            </div>
                          </div>
                        )}
                        
                        {lead.notes && (
                          <div>
                            <div className="font-medium text-sm">Observações</div>
                            <div className="text-sm bg-cyrela-gray-lightest p-2 rounded">
                              {lead.notes}
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button 
                            className="w-full bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90"
                          >
                            Ver detalhes completos
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
