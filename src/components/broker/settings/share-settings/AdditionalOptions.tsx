
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormControl 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { ShareFormValues } from "./types";

export function AdditionalOptions() {
  const form = useFormContext<ShareFormValues>();

  return (
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
  );
}
