
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { NotificationFormValues } from "./types";

interface NotificationEventsProps {
  form: UseFormReturn<NotificationFormValues>;
}

export function NotificationEvents({ form }: NotificationEventsProps) {
  return (
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
  );
}
