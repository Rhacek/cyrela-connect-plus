
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./PropertyFormSchema";

interface BrokerInfoTabProps {
  form: UseFormReturn<PropertyFormValues>;
}

export const BrokerInfoTab = ({ form }: BrokerInfoTabProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informações para Atendimento</CardTitle>
        <CardDescription>
          Estas informações serão visíveis apenas para corretores e não serão exibidas aos clientes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="brokerNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações para Corretores</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Informações importantes para o atendimento ao cliente..."
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Inclua informações relevantes como dicas de negociação, detalhes do proprietário,
                horários disponíveis para visitas, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comissão (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  min={0}
                  max={100}
                  step={0.1}
                />
              </FormControl>
              <FormDescription>
                Percentual de comissão para o corretor que realizar a venda
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
