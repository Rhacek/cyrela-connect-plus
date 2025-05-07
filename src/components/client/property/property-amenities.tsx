
import { Property } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PropertyAmenitiesProps {
  property: Property;
}

export function PropertyAmenities({ property }: PropertyAmenitiesProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Plantas e Acabamentos</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="floor-plans">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="floor-plans">Plantas</TabsTrigger>
            <TabsTrigger value="finishes">Acabamentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="floor-plans" className="mt-4">
            <div className="border rounded-md overflow-hidden">
              <img 
                src="https://cdn.pixabay.com/photo/2014/12/21/23/35/blueprint-575943_1280.png" 
                alt="Planta do imóvel"
                className="w-full h-auto"
              />
              <div className="p-4 bg-cyrela-gray-lightest">
                <h4 className="font-medium mb-1">Planta padrão - {property.area}m²</h4>
                <p className="text-sm text-cyrela-gray-dark">
                  {property.bedrooms} quartos • {property.bathrooms} banheiros • {property.suites} suítes
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="finishes" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <img 
                  src="https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg" 
                  alt="Acabamento sala"
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-center">Sala de estar</p>
              </div>
              
              <div className="space-y-2">
                <img 
                  src="https://cdn.pixabay.com/photo/2016/12/30/07/59/kitchen-1940174_1280.jpg" 
                  alt="Acabamento cozinha"
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-center">Cozinha</p>
              </div>
              
              <div className="space-y-2">
                <img 
                  src="https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg" 
                  alt="Acabamento quarto"
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-center">Quarto</p>
              </div>
              
              <div className="space-y-2">
                <img 
                  src="https://cdn.pixabay.com/photo/2017/02/24/12/22/bathroom-2094716_1280.jpg" 
                  alt="Acabamento banheiro"
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-sm text-center">Banheiro</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
