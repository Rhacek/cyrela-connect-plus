
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Eye, MapPin, Plus, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function BrokerProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();
  
  // Fetch broker properties
  useEffect(() => {
    const fetchProperties = async () => {
      if (!session?.id) return;
      
      try {
        setIsLoading(true);
        const data = await propertiesService.getBrokerProperties(session.id);
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Não foi possível carregar seus imóveis.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [session?.id]);
  
  // Filter properties based on search term
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Meus Imóveis</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={18} />
            <input
              type="text"
              placeholder="Buscar imóveis..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-cyrela-gray-lighter focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button className="w-full md:w-auto">
            <Plus size={16} className="mr-2" />
            Novo Imóvel
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empreendimento</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Nenhum imóvel encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyrela-gray-lighter rounded-md flex items-center justify-center">
                            <Building size={18} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{property.title}</div>
                            <div className="text-xs text-cyrela-gray-dark">{property.type}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-1">
                          <MapPin size={14} className="text-cyrela-gray-dark shrink-0 mt-0.5" />
                          <span>
                            {property.neighborhood}, {property.city}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {property.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye size={16} className="mr-1" />
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
