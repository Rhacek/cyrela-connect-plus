import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProperties } from "@/mocks/property-data";
import { toast } from "@/components/ui/use-toast";
import { BasicInfoTab } from "@/components/admin/property-form/BasicInfoTab";
import { DetailsTab } from "@/components/admin/property-form/DetailsTab";
import { MediaTab } from "@/components/admin/property-form/MediaTab";
import { BrokerInfoTab } from "@/components/admin/property-form/BrokerInfoTab";
import { propertyFormSchema, PropertyFormValues, defaultPropertyValues } from "@/components/admin/property-form/PropertyFormSchema";
const AdminPropertyForm = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [currentTab, setCurrentTab] = useState("basic");
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: defaultPropertyValues
  });
  useEffect(() => {
    if (isEditing) {
      const property = mockProperties.find(p => p.id === id);
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
      }
    }
  }, [id, isEditing, form]);
  const onSubmit = (values: PropertyFormValues) => {
    console.log(values);
    toast.success(isEditing ? "Imóvel atualizado com sucesso!" : "Imóvel cadastrado com sucesso!", {
      description: "As informações foram salvas no sistema."
    });
    navigate("/admin/properties");
  };
  return <div className="space-y-6 w-full overflow-hidden">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing ? "Atualize as informações do imóvel conforme necessário." : "Preencha as informações para cadastrar um novo imóvel."}
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl p-6">
          <TabsTrigger value="basic" className="flex items-center justify-center text-center p-2 whitespace-normal text-sm h-auto min-h-10">
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center justify-center text-center p-2 whitespace-normal text-sm h-auto min-h-10">
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center justify-center text-center p-2 whitespace-normal text-sm h-auto min-h-10">
            Mídia
          </TabsTrigger>
          <TabsTrigger value="broker" className="flex items-center justify-center text-center p-2 whitespace-normal text-sm h-auto min-h-10">
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
              <MediaTab form={form} initialImages={isEditing ? mockProperties.find(p => p.id === id)?.images : []} />
            </TabsContent>
            
            <TabsContent value="broker" className="w-full">
              <BrokerInfoTab form={form} />
            </TabsContent>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/properties")}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar Imóvel" : "Cadastrar Imóvel"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>;
};
export default AdminPropertyForm;