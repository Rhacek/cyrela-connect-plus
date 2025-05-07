
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PropertyFeaturesProps {
  property: Property;
}

export function PropertyFeatures({ property }: PropertyFeaturesProps) {
  // In a real app, these would come from the API
  const features = [
    { name: "Varanda", available: true },
    { name: "Piscina", available: true },
    { name: "Academia", available: true },
    { name: "Churrasqueira", available: true },
    { name: "Salão de festas", available: true },
    { name: "Portaria 24h", available: true },
    { name: "Pet friendly", available: false },
    { name: "Quadra poliesportiva", available: false },
    { name: "Brinquedoteca", available: true },
    { name: "Espaço gourmet", available: true },
    { name: "Sauna", available: false },
    { name: "Playground", available: true },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Características</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-center ${feature.available ? "" : "text-cyrela-gray-medium line-through"}`}
            >
              {feature.available ? (
                <Check size={16} className="mr-2 text-green-500" />
              ) : (
                <div className="w-4 h-4 mr-2" />
              )}
              <span>{feature.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
