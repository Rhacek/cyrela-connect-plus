
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneralSettings, settingsService } from "@/services/settings.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const generalFormSchema = z.object({
  siteName: z.string().min(2, "O nome do site é obrigatório"),
  siteDescription: z.string(),
  contactEmail: z.string().email("Email inválido"),
  contactPhone: z.string().min(8, "Telefone inválido"),
  address: z.string(),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

interface GeneralSettingsFormProps {
  loading: boolean;
  initialData?: GeneralSettings;
  onSuccess?: () => void;
}

export const GeneralSettingsForm = ({ loading, initialData, onSuccess }: GeneralSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: initialData || {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    },
  });

  const onSubmit = async (values: GeneralFormValues) => {
    try {
      setIsSubmitting(true);
      // Make sure we pass a complete GeneralSettings object
      await settingsService.updateGeneralSettings({
        siteName: values.siteName,
        siteDescription: values.siteDescription,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        address: values.address,
      });
      toast.success("Configurações gerais atualizadas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar configurações gerais:", error);
      toast.error("Erro ao atualizar configurações gerais");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-20" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-1/4 h-10 ml-auto" />
        </div>
      ) : (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome que aparecerá no título do navegador e cabeçalhos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Site</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormDescription>
                    Breve descrição do site para SEO
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de Contato</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone de Contato</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
