import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { mockProperties, PropertyStatus } from "@/mocks/property-data";
import { PropertyImageUpload } from "@/components/admin/PropertyImageUpload";
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.string().min(1, "Selecione um tipo de imóvel"),
  status: z.enum([PropertyStatus.AVAILABLE, PropertyStatus.RESERVED, PropertyStatus.SOLD]),
  price: z.coerce.number().positive("O preço deve ser um valor positivo"),
  promotionalPrice: z.coerce.number().nonnegative("O preço promocional deve ser um valor não negativo").optional(),
  area: z.coerce.number().positive("A área deve ser um valor positivo"),
  bedrooms: z.coerce.number().int().nonnegative("O número de quartos não pode ser negativo"),
  bathrooms: z.coerce.number().int().nonnegative("O número de banheiros não pode ser negativo"),
  suites: z.coerce.number().int().nonnegative("O número de suítes não pode ser negativo"),
  parkingSpaces: z.coerce.number().int().nonnegative("O número de vagas não pode ser negativo"),
  address: z.string().min(1, "O endereço é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  zipCode: z.string().min(1, "O CEP é obrigatório"),
  constructionStage: z.string().optional(),
  youtubeUrl: z.string().url("Insira uma URL válida").or(z.string().length(0)).optional(),
  isHighlighted: z.boolean().default(false),
});

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [currentTab, setCurrentTab] = useState("basic");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Apartamento",
      status: PropertyStatus.AVAILABLE,
      price: 0,
      promotionalPrice: undefined,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      suites: 0,
      parkingSpaces: 0,
      address: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      constructionStage: "",
      youtubeUrl: "",
      isHighlighted: false,
    },
  });

  useEffect(() => {
    if (isEditing) {
      const property = mockProperties.find(p => p.id === id);
      if (property) {
        form.reset({
          title: property.title,
          description: property.description,
          type: property.type,
          status: property.status,
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
        });
      }
    }
  }, [id, isEditing, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast.success(
      isEditing 
        ? "Imóvel atualizado com sucesso!" 
        : "Imóvel cadastrado com sucesso!"
    );
    navigate("/admin/properties");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isEditing 
            ? "Atualize as informações do imóvel conforme necessário." 
            : "Preencha as informações para cadastrar um novo imóvel."}
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="media">Mídia</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <TabsContent value="basic">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: Apartamento de Luxo em Moema" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Descreva o imóvel em detalhes..." 
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apartamento">Apartamento</SelectItem>
                              <SelectItem value="Casa">Casa</SelectItem>
                              <SelectItem value="Cobertura">Cobertura</SelectItem>
                              <SelectItem value="Terreno">Terreno</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={PropertyStatus.AVAILABLE}>Disponível</SelectItem>
                              <SelectItem value={PropertyStatus.RESERVED}>Reservado</SelectItem>
                              <SelectItem value={PropertyStatus.SOLD}>Vendido</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="promotionalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço Promocional (R$)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              value={field.value || ''}
                              onChange={(e) => {
                                const value = e.target.value === '' ? undefined : Number(e.target.value);
                                field.onChange(value);
                              }}
                              placeholder="Opcional"
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco se não houver preço promocional
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="constructionStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estágio da Construção</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estágio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Na planta">Na planta</SelectItem>
                              <SelectItem value="Em construção">Em construção</SelectItem>
                              <SelectItem value="Pronto para morar">Pronto para morar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartos</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banheiros</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="suites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suítes</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parkingSpaces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vagas</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} min={0} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Rua, número" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">Imagens do Imóvel</h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione fotos do imóvel. A primeira imagem será utilizada como capa.
                  </p>
                  
                  <FormField
                    control={form.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Vídeo (YouTube)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Ex: https://www.youtube.com/watch?v=abc123" 
                          />
                        </FormControl>
                        <FormDescription>
                          Adicione o link do vídeo do YouTube para promover o imóvel
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <PropertyImageUpload 
                    initialImages={isEditing ? mockProperties.find(p => p.id === id)?.images : []}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/properties")}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Atualizar Imóvel" : "Cadastrar Imóvel"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default AdminPropertyForm;
