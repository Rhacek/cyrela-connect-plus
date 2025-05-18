
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the schema for share settings
const shareFormSchema = z.object({
  defaultExpirationEnabled: z.boolean().default(true),
  defaultExpirationDays: z.coerce.number().min(1).max(365).default(30),
  autoGenerateNotes: z.boolean().default(false),
  notifyOnShareClick: z.boolean().default(true),
  defaultShareMode: z.enum(["standard", "short", "branded"]).default("standard"),
  appendUTMParameters: z.boolean().default(true)
});

type ShareFormValues = z.infer<typeof shareFormSchema>;

export interface ShareSettings {
  defaultExpirationEnabled: boolean;
  defaultExpirationDays: number;
  autoGenerateNotes: boolean;
  notifyOnShareClick: boolean;
  defaultShareMode: "standard" | "short" | "branded";
  appendUTMParameters: boolean;
}

interface ShareSettingsFormProps {
  loading: boolean;
  initialData?: ShareSettings;
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

  // Get the value of defaultExpirationEnabled to conditionally render the days input
  const expirationEnabled = form.watch("defaultExpirationEnabled");

  const onSubmit = async (values: ShareFormValues) => {
    try {
      setIsSubmitting(true);
      // Use existing broker settings service to update share settings
      // We're extending the broker settings service functionality
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulating API call
      
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
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Expiração de Links</h3>
          
          <FormField
            control={form.control}
            name="defaultExpirationEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Expiração Automática</FormLabel>
                  <FormDescription>
                    Definir prazo de expiração para links compartilhados
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

          {expirationEnabled && (
            <FormField
              control={form.control}
              name="defaultExpirationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dias até expiração</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min={1} max={365} />
                  </FormControl>
                  <FormDescription>
                    Número de dias até que um link compartilhado expire
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Preferências de Compartilhamento</h3>
          
          <FormField
            control={form.control}
            name="defaultShareMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formato de URL Padrão</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o formato de URL" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standard">Padrão (URL completa)</SelectItem>
                    <SelectItem value="short">Encurtada</SelectItem>
                    <SelectItem value="branded">Personalizada com marca</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Formato preferido para links compartilhados
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
                  <FormLabel className="text-base">Parâmetros UTM</FormLabel>
                  <FormDescription>
                    Adicionar parâmetros UTM para análise de tráfego
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
            name="autoGenerateNotes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notas Automáticas</FormLabel>
                  <FormDescription>
                    Gerar notas automáticas ao compartilhar imóveis
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
          <h3 className="text-lg font-medium">Notificações de Compartilhamento</h3>
          
          <FormField
            control={form.control}
            name="notifyOnShareClick"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notificar Cliques</FormLabel>
                  <FormDescription>
                    Receber notificações quando alguém clicar em um link compartilhado
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
