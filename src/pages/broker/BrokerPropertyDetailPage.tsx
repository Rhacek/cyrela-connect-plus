import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Check, 
  Construction, 
  Building, 
  ArrowLeft,
  Share,
  Calendar
} from "lucide-react";
import { PropertyGallery } from "@/components/client/property/property-gallery";
import { PropertyDetails } from "@/components/client/property/property-details";
import { PropertyLocation } from "@/components/client/property/property-location";
import { PropertyAmenities } from "@/components/client/property/property-amenities";
import { PropertyScheduleVisitButton } from "@/components/broker/property/property-schedule-visit-button";
import { PropertyShareButton } from "@/components/broker/property/property-share-button";

const BrokerPropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await propertiesService.getById(id);
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Erro ao carregar imóvel",
          description: "Não foi possível carregar os detalhes do imóvel.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, toast]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-8">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Imóvel não encontrado</h2>
          <p className="text-muted-foreground">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  const getConstructionStageIcon = (stage?: string) => {
    switch (stage) {
      case "Na planta":
        return <Building size={16} className="mr-2" />;
      case "Em construção":
        return <Construction size={16} className="mr-2" />;
      case "Pronto para morar":
        return <Check size={16} className="mr-2" />;
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="container py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin size={16} className="mr-1" />
              <span>
                {property.address}, {property.neighborhood}, {property.city} - {property.state}
              </span>
            </div>
          </div>

          <PropertyGallery images={property.images || []} />

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="location">Localização</TabsTrigger>
              <TabsTrigger value="amenities">Comodidades</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <PropertyDetails property={property} />
            </TabsContent>
            <TabsContent value="location">
              <PropertyLocation property={property} />
            </TabsContent>
            <TabsContent value="amenities">
              <PropertyAmenities property={property} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">Valor</span>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(property.price)}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <Bed size={20} />
                  <span className="text-sm mt-1">{property.bedrooms} quartos</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <Bath size={20} />
                  <span className="text-sm mt-1">{property.bathrooms} banheiros</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <Square size={20} />
                  <span className="text-sm mt-1">{property.area}m²</span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-4">
              <Badge className="flex items-center w-fit mb-2">
                {getConstructionStageIcon(property.constructionStage)}
                {property.constructionStage || "Não informado"}
              </Badge>
              
              {property.deliveryDate && (
                <div className="text-sm text-muted-foreground">
                  Entrega prevista: {new Date(property.deliveryDate).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <PropertyScheduleVisitButton propertyId={property.id} className="w-full" />
              <PropertyShareButton property={property} className="w-full" />
            </div>
          </div>

          {/* Property Code */}
          <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="text-sm text-muted-foreground">Código do imóvel</div>
            <div className="font-mono">{property.code || property.id.substring(0, 8).toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerPropertyDetailPage;
