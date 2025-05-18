
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ShareFormValues } from "./types";

export function ExpirationSettings() {
  const form = useFormContext<ShareFormValues>();

  return (
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
  );
}
