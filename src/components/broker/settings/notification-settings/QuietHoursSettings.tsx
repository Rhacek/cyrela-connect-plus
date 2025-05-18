
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { NotificationFormValues } from "./types";

interface QuietHoursSettingsProps {
  form: UseFormReturn<NotificationFormValues>;
}

export function QuietHoursSettings({ form }: QuietHoursSettingsProps) {
  return (
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
  );
}
