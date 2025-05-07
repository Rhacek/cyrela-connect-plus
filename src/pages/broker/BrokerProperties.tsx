
import { useSidebar } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PropertyStatus, mockProperties } from "@/mocks/property-data";
import { Button } from "@/components/ui/button";
import { Building, Eye, MapPin, Plus, Search } from "lucide-react";
import { useState } from "react";

export default function BrokerProperties() {
  const { state } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProperties = mockProperties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 min-h-screen">
      <div className={`flex-1 p-6 ${state === "expanded" ? "md:ml-[16rem]" : "md:ml-[3rem]"} transition-all duration-300`}>
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
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empreendimento</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
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
                      <TableCell>
                        <div className={`px-2 py-1 text-xs font-medium rounded-full inline-flex w-fit ${
                          property.status === PropertyStatus.AVAILABLE 
                            ? "bg-green-100 text-green-800" 
                            : property.status === PropertyStatus.RESERVED
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {property.status === PropertyStatus.AVAILABLE 
                            ? "Disponível" 
                            : property.status === PropertyStatus.RESERVED
                            ? "Reservado"
                            : "Vendido"
                          }
                        </div>
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
        </div>
      </div>
    </div>
  );
}
