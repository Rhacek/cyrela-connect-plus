
import { useState } from "react";
import { Link } from "react-router-dom";
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
  Plus, 
  Search, 
  MoreHorizontal, 
  PenSquare, 
  Trash, 
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Dados fictícios para demonstração
const mockBrokers = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@cyrela.com.br",
    phone: "(11) 99876-5432",
    brokerCode: "BR001",
    brokerage: "Cyrela Imóveis",
    status: "active",
    properties: 12,
    clients: 28
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@cyrela.com.br",
    phone: "(11) 98765-4321",
    brokerCode: "BR002",
    brokerage: "Cyrela Lançamentos",
    status: "active",
    properties: 8,
    clients: 15
  },
  {
    id: "3",
    name: "Mariana Costa",
    email: "mariana.costa@cyrela.com.br",
    phone: "(11) 97654-3210",
    brokerCode: "BR003",
    brokerage: "Cyrela Imóveis",
    status: "inactive",
    properties: 0,
    clients: 0
  }
];

const AdminBrokers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredBrokers = mockBrokers.filter(
    broker => broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Corretores</h1>
          <p className="text-muted-foreground mt-2">Gerencie todos os corretores do sistema.</p>
        </div>
        <Button asChild>
          <Link to="/admin/brokers/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Corretor
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar corretores..."
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
              <TableHead>Código</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Imóveis</TableHead>
              <TableHead>Clientes</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBrokers.map((broker) => (
              <TableRow key={broker.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {broker.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{broker.name}</p>
                      <p className="text-xs text-muted-foreground">{broker.brokerage}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{broker.brokerCode}</TableCell>
                <TableCell>
                  <div>
                    <p>{broker.email}</p>
                    <p className="text-xs text-muted-foreground">{broker.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {broker.status === "active" ? (
                    <Badge className="bg-green-500">Ativo</Badge>
                  ) : (
                    <Badge variant="outline">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell>{broker.properties}</TableCell>
                <TableCell>{broker.clients}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/brokers/${broker.id}/edit`}>
                          <PenSquare className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </Link>
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

export default AdminBrokers;
