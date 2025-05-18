
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormDescription, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { ShareFormValues } from "./types";

export function LinkFormatSettings() {
  const form = useFormContext<ShareFormValues>();

  return (
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
  );
}
