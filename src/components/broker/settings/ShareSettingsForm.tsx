
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { BrokerShareSettings, brokerSettingsService } from "@/services/broker-settings.service";
import { toast } from "sonner";
import { FormSkeleton } from "./notification-settings/FormSkeleton";
import { shareFormSchema, ShareFormValues } from "./share-settings/types";
import { LinkFormatSettings } from "./share-settings/LinkFormatSettings";
import { ExpirationSettings } from "./share-settings/ExpirationSettings";
import { AdditionalOptions } from "./share-settings/AdditionalOptions";

interface ShareSettingsFormProps {
  loading: boolean;
  initialData?: BrokerShareSettings;
  onSuccess?: () => void;
}

export const ShareSettingsForm = ({ loading, initialData, onSuccess }: ShareSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: initialData || {
      defaultExpirationEnabled: true,
      defaultExpirationDays: 30,
      autoGenerateNotes: false,
      notifyOnShareClick: true,
      defaultShareMode: "standard",
      appendUTMParameters: true
    },
  });

  const onSubmit = async (values: ShareFormValues) => {
    try {
      setIsSubmitting(true);
      await brokerSettingsService.updateBrokerShareSettings(values);
      toast.success("Configurações de compartilhamento atualizadas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar configurações de compartilhamento:", error);
      toast.error("Erro ao atualizar configurações de compartilhamento");
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
        <LinkFormatSettings />
        <ExpirationSettings />
        <AdditionalOptions />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
