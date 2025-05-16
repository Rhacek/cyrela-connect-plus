
import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { 
  settingsService, 
  GeneralSettings, 
  EmailSettings, 
  FeatureSettings 
} from "@/services/settings.service";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [loading, setLoading] = useState({
    general: true,
    email: true,
    features: true
  });
  
  const [activeTab, setActiveTab] = useState("general");

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      smtpServer: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      senderEmail: "",
      senderName: "",
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

  useEffect(() => {
    const loadGeneralSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, general: true }));
        const generalSettings = await settingsService.getGeneralSettings();
        generalForm.reset(generalSettings);
      } catch (error) {
        console.error("Erro ao carregar configurações gerais:", error);
        toast.error("Erro ao carregar configurações gerais");
      } finally {
        setLoading((prev) => ({ ...prev, general: false }));
      }
    };

    loadGeneralSettings();
  }, [generalForm]);

  useEffect(() => {
    const loadEmailSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, email: true }));
        const emailSettings = await settingsService.getEmailSettings();
        emailForm.reset(emailSettings);
      } catch (error) {
        console.error("Erro ao carregar configurações de email:", error);
        toast.error("Erro ao carregar configurações de email");
      } finally {
        setLoading((prev) => ({ ...prev, email: false }));
      }
    };

    loadEmailSettings();
  }, [emailForm]);

  useEffect(() => {
    const loadFeatureSettings = async () => {
      try {
        setLoading((prev) => ({ ...prev, features: true }));
        const featureSettings = await settingsService.getFeatureSettings();
        featuresForm.reset(featureSettings);
      } catch (error) {
        console.error("Erro ao carregar configurações de funcionalidades:", error);
        toast.error("Erro ao carregar configurações de funcionalidades");
      } finally {
        setLoading((prev) => ({ ...prev, features: false }));
      }
    };

    loadFeatureSettings();
  }, [featuresForm]);

  const onGeneralSubmit = async (values: z.infer<typeof generalFormSchema>) => {
    try {
      await settingsService.updateGeneralSettings(values);
      toast.success("Configurações gerais atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar configurações gerais:", error);
      toast.error("Erro ao atualizar configurações gerais");
    }
  };

  const onEmailSubmit = async (values: z.infer<typeof emailFormSchema>) => {
    try {
      await settingsService.updateEmailSettings(values);
      toast.success("Configurações de email atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar configurações de email:", error);
      toast.error("Erro ao atualizar configurações de email");
    }
  };

  const onFeaturesSubmit = async (values: z.infer<typeof featuresFormSchema>) => {
    try {
      await settingsService.updateFeatureSettings(values);
      toast.success("Configurações de funcionalidades atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar configurações de funcionalidades:", error);
      toast.error("Erro ao atualizar configurações de funcionalidades");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações gerais do sistema.
        </p>
      </div>

      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
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
              {loading.general ? (
                <div className="space-y-4">
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-full h-20" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <Skeleton className="w-full h-10" />
                  <Skeleton className="w-1/4 h-10 ml-auto" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.email ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                  <Skeleton className="w-1/4 h-10 ml-auto" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.features ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Skeleton key={index} className="w-full h-20" />
                  ))}
                  <Skeleton className="w-1/4 h-10 ml-auto" />
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
