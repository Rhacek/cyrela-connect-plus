
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
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  MoreHorizontal, 
  MessageSquare, 
  Trash,
  Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadStatus } from "@/types";

// Dados fictícios para demonstração
const mockLeads = [
  {
    id: "1",
    name: "João Santos",
    email: "joao.santos@gmail.com",
    phone: "(11) 99876-5432",
    status: LeadStatus.NEW,
    createdAt: new Date("2025-05-10T10:30:00"),
    source: "Website",
    propertyId: "1",
    propertyTitle: "Cyrela Iconyc Santos"
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria.oliveira@hotmail.com",
    phone: "(11) 98765-4321",
    status: LeadStatus.CONTACTED,
    createdAt: new Date("2025-05-09T14:20:00"),
    source: "Facebook",
    propertyId: "3",
    propertyTitle: "Lavvi Moema"
  },
  {
    id: "3",
    name: "Pedro Souza",
    email: "pedro.souza@gmail.com",
    phone: "(11) 97654-3210",
    status: LeadStatus.INTERESTED,
    createdAt: new Date("2025-05-08T09:15:00"),
    source: "Instagram",
    propertyId: "2",
    propertyTitle: "Living Exclusive Morumbi"
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana.costa@gmail.com",
    phone: "(11) 96543-2109",
    status: LeadStatus.SCHEDULED,
    createdAt: new Date("2025-05-07T16:45:00"),
    source: "Email Marketing",
    propertyId: "4",
    propertyTitle: "Cyrela Bothanic Campo Belo"
  },
  {
    id: "5",
    name: "Carlos Lima",
    email: "carlos.lima@outlook.com",
    phone: "(11) 95432-1098",
    status: LeadStatus.VISITED,
    createdAt: new Date("2025-05-06T11:30:00"),
    source: "Google Ads",
    propertyId: "5",
    propertyTitle: "Cyrela Landscape Perdizes"
  }
];

const getStatusBadge = (status: LeadStatus) => {
  switch (status) {
    case LeadStatus.NEW:
      return <Badge className="bg-blue-500">Novo</Badge>;
    case LeadStatus.CONTACTED:
      return <Badge className="bg-purple-500">Contatado</Badge>;
    case LeadStatus.INTERESTED:
      return <Badge className="bg-yellow-500">Interessado</Badge>;
    case LeadStatus.SCHEDULED:
      return <Badge className="bg-orange-500">Agendado</Badge>;
    case LeadStatus.VISITED:
      return <Badge className="bg-green-500">Visitou</Badge>;
    case LeadStatus.CONVERTED:
      return <Badge className="bg-emerald-500">Convertido</Badge>;
    case LeadStatus.LOST:
      return <Badge variant="outline">Perdido</Badge>;
    default:
      return <Badge>Desconhecido</Badge>;
  }
};

const AdminLeads = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredLeads = mockLeads.filter(
    lead => lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Leads</h1>
        <p className="text-muted-foreground mt-2">Visualize e gerencie todos os leads no sistema.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Imóvel</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div>
                    <p>{lead.email}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell>{formatDate(lead.createdAt)}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>
                  <span className="line-clamp-1">{lead.propertyTitle}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Visualizar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Enviar Mensagem</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminLeads;
