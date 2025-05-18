
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
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrokerShareSettings, brokerSettingsService } from "@/services/broker-settings.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const shareFormSchema = z.object({
  defaultExpirationEnabled: z.boolean().default(true),
  defaultExpirationDays: z.number().min(1).max(365),
  autoGenerateNotes: z.boolean().default(false),
  notifyOnShareClick: z.boolean().default(true),
  defaultShareMode: z.enum(["standard", "short", "branded"]),
  appendUTMParameters: z.boolean().default(true),
});

type ShareFormValues = z.infer<typeof shareFormSchema>;

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
      await brokerSettingsService.updateBrokerShareSettings({
        defaultExpirationEnabled: values.defaultExpirationEnabled,
        defaultExpirationDays: values.defaultExpirationDays,
        autoGenerateNotes: values.autoGenerateNotes,
        notifyOnShareClick: values.notifyOnShareClick,
        defaultShareMode: values.defaultShareMode,
        appendUTMParameters: values.appendUTMParameters
      });
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
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((index) => (
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
          <h3 className="text-lg font-medium">Links de Compartilhamento</h3>
          
          <FormField
            control={form.control}
            name="defaultShareMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formato de URL padrão</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Padrão (URL completa)</SelectItem>
                    <SelectItem value="short">URL curta</SelectItem>
                    <SelectItem value="branded">URL personalizada</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Escolha o formato de URL padrão para compartilhamentos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appendUTMParameters"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Adicionar parâmetros UTM</FormLabel>
                  <FormDescription>
                    Adicionar parâmetros UTM para rastreamento de marketing
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
          <h3 className="text-lg font-medium">Expiração de Links</h3>
          
          <FormField
            control={form.control}
            name="defaultExpirationEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Habilitar expiração automática</FormLabel>
                  <FormDescription>
                    Links compartilhados expirarão automaticamente
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

          {form.watch("defaultExpirationEnabled") && (
            <FormField
              control={form.control}
              name="defaultExpirationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias até expiração</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Número de dias até que os links compartilhados expirem
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Opções Adicionais</h3>
          
          <FormField
            control={form.control}
            name="autoGenerateNotes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Gerar notas automaticamente</FormLabel>
                  <FormDescription>
                    Adicionar data de compartilhamento como nota automaticamente
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
                  <FormLabel className="text-base">Notificar sobre cliques</FormLabel>
                  <FormDescription>
                    Receber notificação quando alguém clicar em um link compartilhado
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

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
