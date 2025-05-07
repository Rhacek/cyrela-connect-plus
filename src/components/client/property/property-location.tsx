
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyLocationProps {
  property: Property;
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Localização</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="text-cyrela-gray-dark shrink-0 mt-1" size={18} />
            <p className="text-cyrela-gray-dark">
              {property.address}, {property.neighborhood}, {property.city}, {property.state}, CEP {property.zipCode}
            </p>
          </div>
          
          <div className="aspect-video bg-cyrela-gray-lighter rounded-md overflow-hidden relative">
            {/* Placeholder for map - in a real app, this would be a Google Map or similar */}
            <div className="absolute inset-0 flex items-center justify-center bg-cyrela-gray-lighter">
              <div className="text-center">
                <MapPin className="mx-auto text-cyrela-gray-dark mb-2" size={32} />
                <p className="text-cyrela-gray-dark">Mapa de localização</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-cyrela-gray-medium text-sm">Escola</p>
              <p className="font-semibold">800m</p>
            </div>
            <div className="space-y-1">
              <p className="text-cyrela-gray-medium text-sm">Hospital</p>
              <p className="font-semibold">1.2km</p>
            </div>
            <div className="space-y-1">
              <p className="text-cyrela-gray-medium text-sm">Shopping</p>
              <p className="font-semibold">2.5km</p>
            </div>
            <div className="space-y-1">
              <p className="text-cyrela-gray-medium text-sm">Parque</p>
              <p className="font-semibold">500m</p>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${property.address}+${property.city}`, '_blank')}>
            <MapPin className="mr-2" size={16} />
            Ver no Google Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
