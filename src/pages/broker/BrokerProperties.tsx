
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building, Eye, MapPin, Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { PropertyFilter } from "@/components/client/property-filter";
import { PropertyListings } from "@/components/client/property/property-listings";
import { usePropertyFilters } from "@/hooks/use-property-filters";

export default function BrokerProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const { session } = useAuth();
  const navigate = useNavigate();
  
  // Use our custom hook for filtering
  const { 
    filters, 
    setFilters, 
    filteredProperties 
  } = usePropertyFilters(properties);
  
  // Fetch all active properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const data = await propertiesService.getAllActiveProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Não foi possível carregar os imóveis.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
  // Check if user is admin
  const isAdmin = session?.user_metadata?.role === UserRole.ADMIN;
  
  // Navigate to property details
  const handleViewDetails = (propertyId: string) => {
    navigate(`/broker/properties/${propertyId}`);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Imóveis Disponíveis</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full">
            <PropertyFilter 
              properties={properties}
              isLoading={isLoading}
              initialFilters={{
                search: filters.search,
                priceRange: filters.priceRange,
                locations: filters.locations,
                features: filters.selectedFeatures,
                stages: filters.stages
              }}
              onFilterChange={(filtered) => {
                // We don't need to do anything here since we're using the hook
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Button 
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? 'Visualização em Grid' : 'Visualização em Lista'}
            </Button>
            
            {/* Only show "Novo Imóvel" button for admin users */}
            {isAdmin && (
              <Button 
                className="w-full md:w-auto"
                onClick={() => navigate("/admin/properties/new/")}
              >
                <Plus size={16} className="mr-2" />
                Novo Imóvel
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="mt-4">
              <PropertyListings 
                properties={filteredProperties} 
                linkPrefix="/broker/properties"
              />
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
                        Nenhum imóvel disponível com os filtros selecionados
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
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(property.id)}
                          >
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
          )
        )}
      </div>
    </div>
  );
}
