
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { BasicInfoTab } from "@/components/admin/property-form/BasicInfoTab";
import { DetailsTab } from "@/components/admin/property-form/DetailsTab";
import { MediaTab } from "@/components/admin/property-form/MediaTab";
import { BrokerInfoTab } from "@/components/admin/property-form/BrokerInfoTab";
import { propertyFormSchema, PropertyFormValues, defaultPropertyValues } from "@/components/admin/property-form/PropertyFormSchema";
import { propertiesService } from "@/services/properties.service";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const isEditing = Boolean(id);
  const [currentTab, setCurrentTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultPropertyValues
  });
  
  useEffect(() => {
    if (isEditing && id) {
      const fetchProperty = async () => {
        try {
          setIsLoading(true);
          const property = await propertiesService.getById(id);
          
          if (property) {
            form.reset({
              title: property.title,
              developmentName: property.developmentName || "",
              description: property.description,
              type: property.type,
              price: property.price,
              promotionalPrice: property.promotionalPrice,
              area: property.area,
              bedrooms: property.bedrooms,
              bathrooms: property.bathrooms,
              suites: property.suites,
              parkingSpaces: property.parkingSpaces,
              address: property.address,
              neighborhood: property.neighborhood,
              city: property.city,
              state: property.state,
              zipCode: property.zipCode,
              constructionStage: property.constructionStage || "",
              youtubeUrl: property.youtubeUrl || "",
              isHighlighted: property.isHighlighted,
              brokerNotes: property.brokerNotes || "",
              commission: property.commission || 0
            });
          } else {
            toast({
              variant: "destructive",
              title: "Imóvel não encontrado",
              description: "O imóvel que você está tentando editar não foi encontrado."
            });
            navigate("/admin/properties");
          }
        } catch (error) {
          console.error("Error fetching property:", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar imóvel",
            description: "Ocorreu um erro ao carregar as informações do imóvel."
          });
          navigate("/admin/properties");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProperty();
    }
  }, [id, isEditing, form, navigate]);
  
  const onSubmit = async (values: PropertyFormValues) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Não autenticado",
        description: "Você precisa estar logado para cadastrar um imóvel."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && id) {
        // Update existing property
        await propertiesService.update(id, {
          ...values,
          createdById: session.id
        });
        
        toast({
          title: "Imóvel atualizado com sucesso!",
          description: "As informações foram salvas no sistema."
        });
      } else {
        // Create new property
        const newProperty = await propertiesService.create({
          ...values,
          createdById: session.id
        });
        
        toast({
          title: "Imóvel cadastrado com sucesso!",
          description: "O novo imóvel foi adicionado ao sistema."
        });
      }
      
      navigate("/admin/properties");
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar imóvel",
        description: "Ocorreu um erro ao salvar as informações do imóvel. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-muted-foreground">Carregando informações do imóvel...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing ? "Atualize as informações do imóvel conforme necessário." : "Preencha as informações para cadastrar um novo imóvel."}
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl px-2 py-2 gap-1 min-h-12 items-center justify-center">
          <TabsTrigger 
            value="basic" 
            className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
          >
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
          >
            Detalhes
          </TabsTrigger>
          <TabsTrigger 
            value="media" 
            className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
          >
            Mídia
          </TabsTrigger>
          <TabsTrigger 
            value="broker" 
            className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
          >
            Info. Corretor
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6 w-full">
            <TabsContent value="basic" className="w-full">
              <BasicInfoTab form={form} />
            </TabsContent>

            <TabsContent value="details" className="w-full">
              <DetailsTab form={form} />
            </TabsContent>

            <TabsContent value="media" className="w-full">
              <MediaTab 
                form={form} 
                initialImages={[]} 
                propertyId={isEditing ? id : undefined}
              />
            </TabsContent>
            
            <TabsContent value="broker" className="w-full">
              <BrokerInfoTab form={form} />
            </TabsContent>

            <div className="flex justify-end gap-4 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin/properties")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Atualizando..." : "Cadastrando..."}
                  </>
                ) : (
                  isEditing ? "Atualizar Imóvel" : "Cadastrar Imóvel"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default AdminPropertyForm;
