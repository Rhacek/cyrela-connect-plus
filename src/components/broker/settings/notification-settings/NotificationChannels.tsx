
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

interface NotificationChannelsProps {
  form: UseFormReturn<NotificationFormValues>;
}

export function NotificationChannels({ form }: NotificationChannelsProps) {
  return (
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
  );
}
