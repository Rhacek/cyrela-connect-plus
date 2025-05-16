
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
  Eye,
  Building,
  Loader2
} from "lucide-react";
import { PropertyFilter } from "@/components/client/property-filter";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertiesService.getAll();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Erro ao carregar os imóveis", {
          description: "Tente novamente mais tarde."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [toast]);

  const handleDeleteProperty = async (id: string) => {
    try {
      setDeletingId(id);
      await propertiesService.delete(id);
      setProperties(prevProperties => 
        prevProperties.filter(property => property.id !== id)
      );
      toast.success("Imóvel excluído com sucesso");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erro ao excluir o imóvel", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const filteredProperties = properties.filter(
    property => property.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading skeletons for properties table
  const PropertyTableSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b">
          <Skeleton className="h-10 w-10 rounded-md" />
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
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Imóveis</h1>
        <p className="text-muted-foreground mt-2">Gerencie todos os imóveis do sistema.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar imóveis..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button asChild>
          <Link to="/admin/properties/new">
            <Plus size={18} className="mr-2" />
            Novo Imóvel
          </Link>
        </Button>
      </div>

      <div className="rounded-md border w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          {loading ? (
            <PropertyTableSkeleton />
          ) : filteredProperties.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Etapa</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {property.images && property.images[0] ? (
                          <img 
                            src={property.images[0].url} 
                            alt={property.title}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                            <Building size={16} />
                          </div>
                        )}
                        {property.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {property.neighborhood}, {property.city}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(property.price)}
                    </TableCell>
                    <TableCell>
                      {property.constructionStage || "Não informado"}
                    </TableCell>
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
                            <Link to={`/client/property/${property.id}`} className="flex items-center">
                              <Eye size={18} className="mr-2" />
                              <span>Visualizar</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/properties/${property.id}/edit`} className="flex items-center">
                              <PenSquare size={18} className="mr-2" />
                              <span>Editar</span>
                            </Link>
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive flex items-center">
                                <Trash size={18} className="mr-2" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o imóvel "{property.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteProperty(property.id)}
                                  disabled={deletingId === property.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === property.id ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Excluindo...
                                    </>
                                  ) : (
                                    "Excluir"
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
              <Building size={48} className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">Nenhum imóvel encontrado</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                {searchQuery ? 
                  "Não encontramos imóveis com os critérios de busca informados." : 
                  "Não há imóveis cadastrados no sistema."}
              </p>
              <Button asChild>
                <Link to="/admin/properties/new">
                  <Plus size={18} className="mr-2" />
                  Adicionar imóvel
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
