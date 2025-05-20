import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import { MapPin, Bed, Bath, Square, Home } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Descrição */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Descrição</h3>
        <p className="text-muted-foreground whitespace-pre-line">
          {property.description || "Sem descrição disponível para este imóvel."}
        </p>
      </div>

      {/* Características */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Características</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{property.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Quartos</p>
            </div>
          </div>
          <div className="flex items-center">
            <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{property.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Banheiros</p>
            </div>
          </div>
          <div className="flex items-center">
            <Square className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{property.area}m²</p>
              <p className="text-xs text-muted-foreground">Área</p>
            </div>
          </div>
          {property.parkingSpots && (
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{property.parkingSpots}</p>
                <p className="text-xs text-muted-foreground">Vagas</p>
              </div>
            </div>
          )}
          {property.constructionStage && (
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{property.constructionStage}</p>
                <p className="text-xs text-muted-foreground">Estágio</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Endereço</h3>
        <p className="text-muted-foreground">
          {property.address}, {property.neighborhood}, {property.city} - {property.state}
        </p>
      </div>

      {/* Valores */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Valores</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="font-medium">{formatCurrency(property.price)}</p>
          </div>
          {property.condoFee && (
            <div>
              <p className="text-sm text-muted-foreground">Condomínio</p>
              <p className="font-medium">{formatCurrency(property.condoFee)}</p>
            </div>
          )}
          {property.iptu && (
            <div>
              <p className="text-sm text-muted-foreground">IPTU</p>
              <p className="font-medium">{formatCurrency(property.iptu)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
