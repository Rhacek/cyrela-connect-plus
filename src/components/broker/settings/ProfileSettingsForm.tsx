
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { BrokerProfileSettings, brokerSettingsService } from "@/services/broker-settings.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const profileFormSchema = z.object({
  showPhone: z.boolean().default(true),
  showEmail: z.boolean().default(true),
  showSocialMedia: z.boolean().default(true),
  autoReplyToLeads: z.boolean().default(true),
  leadNotificationEmail: z.string().email("Email inválido").or(z.string().length(0)),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsFormProps {
  loading: boolean;
  initialData?: BrokerProfileSettings;
  onSuccess?: () => void;
}

export const ProfileSettingsForm = ({ loading, initialData, onSuccess }: ProfileSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData || {
      showPhone: true,
      showEmail: true,
      showSocialMedia: true,
      autoReplyToLeads: true,
      leadNotificationEmail: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      await brokerSettingsService.updateBrokerProfileSettings({
        showPhone: values.showPhone,
        showEmail: values.showEmail,
        showSocialMedia: values.showSocialMedia,
        autoReplyToLeads: values.autoReplyToLeads,
        leadNotificationEmail: values.leadNotificationEmail,
      });
      toast.success("Configurações de perfil atualizadas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar configurações de perfil:", error);
      toast.error("Erro ao atualizar configurações de perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <Skeleton key={index} className="w-full h-20" />
        ))}
        <Skeleton className="w-1/4 h-10 ml-auto" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="showPhone"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Exibir Telefone</FormLabel>
                <FormDescription>
                  Exibir seu número de telefone no seu perfil público
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
          control={form.control}
          name="showEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Exibir Email</FormLabel>
                <FormDescription>
                  Exibir seu email no seu perfil público
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
          control={form.control}
          name="showSocialMedia"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Exibir Redes Sociais</FormLabel>
                <FormDescription>
                  Exibir suas redes sociais no seu perfil público
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
          control={form.control}
          name="autoReplyToLeads"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Resposta Automática</FormLabel>
                <FormDescription>
                  Enviar resposta automática para novos leads
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
          control={form.control}
          name="leadNotificationEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email para Notificações de Leads</FormLabel>
              <FormDescription>
                Deixe em branco para usar seu email principal
              </FormDescription>
              <FormControl>
                <Input {...field} type="email" placeholder="seu-email@exemplo.com" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
