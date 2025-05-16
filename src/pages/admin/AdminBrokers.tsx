
import { useState, useEffect } from "react";
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
  User,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { brokersService, Broker } from "@/services/brokers.service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminBrokers = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setLoading(true);
        const data = await brokersService.getAll();
        setBrokers(data);
      } catch (error) {
        console.error("Error fetching brokers:", error);
        toast.error("Erro ao carregar os corretores", {
          description: "Tente novamente mais tarde."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, [toast]);

  const handleDeleteBroker = async (id: string) => {
    try {
      setDeletingId(id);
      await brokersService.delete(id);
      setBrokers(prevBrokers => 
        prevBrokers.map(broker => 
          broker.id === id 
            ? { ...broker, status: "inactive", brokerCode: null, brokerage: null } 
            : broker
        )
      );
      toast.success("Corretor desativado com sucesso");
    } catch (error) {
      console.error("Error deactivating broker:", error);
      toast.error("Erro ao desativar o corretor", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const filteredBrokers = brokers.filter(
    broker => broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeletons for brokers table
  const BrokerTableSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full max-w-[250px]" />
            <Skeleton className="h-4 w-full max-w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Corretores</h1>
        <p className="text-muted-foreground mt-2">Gerencie todos os corretores do sistema.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar corretores..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button asChild>
          <Link to="/admin/brokers/new">
            <Plus size={18} className="mr-2" />
            Novo Corretor
          </Link>
        </Button>
      </div>

      <div className="rounded-md border w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          {loading ? (
            <BrokerTableSkeleton />
          ) : filteredBrokers.length > 0 ? (
            <Table className="w-full">
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
                          <p className="text-xs text-muted-foreground">{broker.brokerage || "Sem imobiliária"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{broker.brokerCode || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <p>{broker.email}</p>
                        <p className="text-xs text-muted-foreground">{broker.phone || "Sem telefone"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {broker.status === "active" ? (
                        <Badge className="bg-success">Ativo</Badge>
                      ) : (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell>{broker.properties}</TableCell>
                    <TableCell>{broker.clients}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/brokers/${broker.id}/edit`} className="flex items-center">
                              <PenSquare size={18} className="mr-2" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive flex items-center">
                                <Trash size={18} className="mr-2" />
                                <span>Desativar</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar desativação</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja desativar o corretor "{broker.name}"? Esta ação não poderá ser desfeita facilmente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteBroker(broker.id)}
                                  disabled={deletingId === broker.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === broker.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Desativando...
                                    </>
                                  ) : (
                                    "Desativar"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <User size={48} className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum corretor encontrado</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchQuery ? 
                  "Não encontramos corretores com os critérios de busca informados." : 
                  "Não há corretores cadastrados no sistema."}
              </p>
              <Button asChild>
                <Link to="/admin/brokers/new">
                  <Plus size={18} className="mr-2" />
                  Adicionar corretor
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBrokers;
