
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Check, Construction } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  const getConstructionStageIcon = (stage?: string) => {
    switch (stage) {
      case "Na planta":
        return <Building size={16} className="mr-1" />;
      case "Em construção":
        return <Construction size={16} className="mr-1" />;
      case "Pronto para morar":
        return <Check size={16} className="mr-1" />;
      default:
        return null;
    }
  };

  // Simulating delivery date (in a real app this would come from the API)
  const getDeliveryDate = () => {
    if (property.constructionStage === "Pronto para morar") {
      return "Pronto para morar";
    } else if (property.constructionStage === "Em construção") {
      return "Previsão de entrega: Dez 2025";
    } else {
      return "Previsão de entrega: Jun 2027";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{property.title}</CardTitle>
            <p className="text-cyrela-gray-dark mt-1">{property.address}, {property.neighborhood}, {property.city}</p>
          </div>
          <Badge className="flex items-center bg-white text-black border">
            {getConstructionStageIcon(property.constructionStage)}
            {property.constructionStage || "Não informado"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mt-2">
          <div className="text-cyrela-gray-medium text-sm">
            {getDeliveryDate()}
          </div>
          
          <div className="mt-4">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(property.price)}
            </div>
            <p className="text-cyrela-gray-medium text-sm">
              Valor de venda
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-cyrela-gray-medium text-sm">Área</p>
              <p className="font-semibold">{property.area} m²</p>
            </div>
            <div>
              <p className="text-cyrela-gray-medium text-sm">Quartos</p>
              <p className="font-semibold">{property.bedrooms}</p>
            </div>
            <div>
              <p className="text-cyrela-gray-medium text-sm">Banheiros</p>
              <p className="font-semibold">{property.bathrooms}</p>
            </div>
            <div>
              <p className="text-cyrela-gray-medium text-sm">Suítes</p>
              <p className="font-semibold">{property.suites}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-cyrela-gray-medium text-sm">Descrição</p>
            <p className="mt-1">{property.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
