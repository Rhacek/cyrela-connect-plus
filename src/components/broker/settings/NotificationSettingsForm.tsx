
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormMessage
} from "@/components/ui/form";
import { BrokerNotificationSettings, brokerSettingsService } from "@/services/broker-settings.service";
import { toast } from "sonner";
import { FormSkeleton } from "./notification-settings/FormSkeleton";
import { NotificationChannels } from "./notification-settings/NotificationChannels";
import { NotificationEvents } from "./notification-settings/NotificationEvents";
import { QuietHoursSettings } from "./notification-settings/QuietHoursSettings";
import { notificationFormSchema, NotificationFormValues } from "./notification-settings/types";

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
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
      >
        <NotificationChannels form={form} />
        <NotificationEvents form={form} />
        <QuietHoursSettings form={form} />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
