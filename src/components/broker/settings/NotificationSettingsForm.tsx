
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
import { BrokerNotificationSettings, brokerSettingsService } from "@/services/broker-settings.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  notifyOnNewLead: z.boolean().default(true),
  notifyOnPropertyView: z.boolean().default(true),
  notifyOnShareClick: z.boolean().default(false),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface NotificationSettingsFormProps {
  loading: boolean;
  initialData?: BrokerNotificationSettings;
  onSuccess?: () => void;
}

export const NotificationSettingsForm = ({ loading, initialData, onSuccess }: NotificationSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: initialData || {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      notifyOnNewLead: true,
      notifyOnPropertyView: true,
      notifyOnShareClick: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00",
    },
  });

  const onSubmit = async (values: NotificationFormValues) => {
    try {
      setIsSubmitting(true);
      await brokerSettingsService.updateBrokerNotificationSettings({
        emailNotifications: values.emailNotifications,
        pushNotifications: values.pushNotifications,
        smsNotifications: values.smsNotifications,
        notifyOnNewLead: values.notifyOnNewLead,
        notifyOnPropertyView: values.notifyOnPropertyView,
        notifyOnShareClick: values.notifyOnShareClick,
        quietHoursStart: values.quietHoursStart,
        quietHoursEnd: values.quietHoursEnd,
      });
      toast.success("Configurações de notificação atualizadas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar configurações de notificação:", error);
      toast.error("Erro ao atualizar configurações de notificação");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
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
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Canais de Notificação</h3>
          
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notificações por Email</FormLabel>
                  <FormDescription>
                    Receber notificações por email
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
            name="pushNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notificações Push</FormLabel>
                  <FormDescription>
                    Receber notificações push no navegador
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
            name="smsNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notificações SMS</FormLabel>
                  <FormDescription>
                    Receber notificações por SMS
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
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Eventos de Notificação</h3>
          
          <FormField
            control={form.control}
            name="notifyOnNewLead"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Novos Leads</FormLabel>
                  <FormDescription>
                    Notificar quando receber um novo lead
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
            name="notifyOnPropertyView"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visualizações de Imóveis</FormLabel>
                  <FormDescription>
                    Notificar quando um imóvel for visualizado
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
            name="notifyOnShareClick"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Cliques em Links Compartilhados</FormLabel>
                  <FormDescription>
                    Notificar quando alguém clicar em um link compartilhado
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
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Horário de Silêncio</h3>
          <p className="text-sm text-muted-foreground">
            Você não receberá notificações durante este período
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quietHoursStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Início</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quietHoursEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fim</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
