
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

const generalFormSchema = z.object({
  siteName: z.string().min(2, "O nome do site é obrigatório"),
  siteDescription: z.string(),
  contactEmail: z.string().email("Email inválido"),
  contactPhone: z.string().min(8, "Telefone inválido"),
  address: z.string(),
});

const emailFormSchema = z.object({
  smtpServer: z.string().min(1, "Servidor SMTP é obrigatório"),
  smtpPort: z.coerce.number().positive("Porta inválida"),
  smtpUser: z.string().min(1, "Usuário SMTP é obrigatório"),
  smtpPassword: z.string().min(1, "Senha SMTP é obrigatória"),
  senderEmail: z.string().email("Email inválido"),
  senderName: z.string().min(1, "Nome do remetente é obrigatório"),
});

const featuresFormSchema = z.object({
  enablePropertyComparisons: z.boolean().default(true),
  enableFavorites: z.boolean().default(true),
  enableReviews: z.boolean().default(false),
  enableShareFeature: z.boolean().default(true),
  enableBrokerProfiles: z.boolean().default(true),
  enableScheduleAppointment: z.boolean().default(true),
});

const AdminSettings = () => {
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "Cyrela Imóveis",
      siteDescription: "Portal de imóveis de alto padrão",
      contactEmail: "contato@cyrela.com.br",
      contactPhone: "(11) 3045-5000",
      address: "Av. Paulista, 1000 - São Paulo, SP",
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      smtpServer: "smtp.cyrela.com.br",
      smtpPort: 587,
      smtpUser: "no-reply@cyrela.com.br",
      smtpPassword: "********",
      senderEmail: "no-reply@cyrela.com.br",
      senderName: "Cyrela Imóveis",
    },
  });

  const featuresForm = useForm<z.infer<typeof featuresFormSchema>>({
    resolver: zodResolver(featuresFormSchema),
    defaultValues: {
      enablePropertyComparisons: true,
      enableFavorites: true,
      enableReviews: false,
      enableShareFeature: true,
      enableBrokerProfiles: true,
      enableScheduleAppointment: true,
    },
  });

  const onGeneralSubmit = (values: z.infer<typeof generalFormSchema>) => {
    console.log(values);
    toast.success("Configurações gerais atualizadas com sucesso!");
  };

  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    console.log(values);
    toast.success("Configurações de email atualizadas com sucesso!");
  };

  const onFeaturesSubmit = (values: z.infer<typeof featuresFormSchema>) => {
    console.log(values);
    toast.success("Configurações de funcionalidades atualizadas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações gerais do sistema.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form 
                  onSubmit={generalForm.handleSubmit(onGeneralSubmit)} 
                  className="space-y-4"
                >
                  <FormField
                    control={generalForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Site</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Nome que aparecerá no título do navegador e cabeçalhos
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Site</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormDescription>
                          Breve descrição do site para SEO
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Contato</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone de Contato</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form 
                  onSubmit={emailForm.handleSubmit(onEmailSubmit)} 
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Servidor SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Porta SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUser"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuário SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha SMTP</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="senderEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email do Remetente</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={emailForm.control}
                      name="senderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Remetente</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...featuresForm}>
                <form 
                  onSubmit={featuresForm.handleSubmit(onFeaturesSubmit)} 
                  className="space-y-4"
                >
                  <FormField
                    control={featuresForm.control}
                    name="enablePropertyComparisons"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Comparação de Imóveis</FormLabel>
                          <FormDescription>
                            Permitir que usuários comparem imóveis lado a lado
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featuresForm.control}
                    name="enableFavorites"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Favoritos</FormLabel>
                          <FormDescription>
                            Permitir que usuários adicionem imóveis aos favoritos
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featuresForm.control}
                    name="enableReviews"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Avaliações</FormLabel>
                          <FormDescription>
                            Permitir que usuários avaliem imóveis e corretores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featuresForm.control}
                    name="enableShareFeature"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Compartilhamento</FormLabel>
                          <FormDescription>
                            Permitir compartilhamento de imóveis em redes sociais
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featuresForm.control}
                    name="enableBrokerProfiles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Perfis de Corretores</FormLabel>
                          <FormDescription>
                            Exibir perfis públicos de corretores
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={featuresForm.control}
                    name="enableScheduleAppointment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Agendamento de Visitas</FormLabel>
                          <FormDescription>
                            Permitir agendamento online de visitas aos imóveis
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit">Salvar Configurações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
