
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FeatureSettings, settingsService } from "@/services/settings.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const featuresFormSchema = z.object({
  enablePropertyComparisons: z.boolean().default(true),
  enableFavorites: z.boolean().default(true),
  enableReviews: z.boolean().default(false),
  enableShareFeature: z.boolean().default(true),
  enableBrokerProfiles: z.boolean().default(true),
  enableScheduleAppointment: z.boolean().default(true),
});

type FeatureFormValues = z.infer<typeof featuresFormSchema>;

interface FeatureSettingsFormProps {
  loading: boolean;
  initialData?: FeatureSettings;
  onSuccess?: () => void;
}

export const FeaturesSettingsForm = ({ loading, initialData, onSuccess }: FeatureSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featuresFormSchema),
    defaultValues: initialData || {
      enablePropertyComparisons: true,
      enableFavorites: true,
      enableReviews: false,
      enableShareFeature: true,
      enableBrokerProfiles: true,
      enableScheduleAppointment: true,
    },
  });

  const onSubmit = async (values: FeatureFormValues) => {
    try {
      setIsSubmitting(true);
      await settingsService.updateFeatureSettings(values);
      toast.success("Configurações de funcionalidades atualizadas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar configurações de funcionalidades:", error);
      toast.error("Erro ao atualizar configurações de funcionalidades");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Skeleton key={index} className="w-full h-20" />
          ))}
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
              name="enablePropertyComparisons"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Comparação de Imóveis</FormLabel>
                    <FormDescription>
                      Permitir que usuários comparem imóveis lado a lado
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
              name="enableFavorites"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Favoritos</FormLabel>
                    <FormDescription>
                      Permitir que usuários adicionem imóveis aos favoritos
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
              name="enableReviews"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Avaliações</FormLabel>
                    <FormDescription>
                      Permitir que usuários avaliem imóveis e corretores
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
              name="enableShareFeature"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Compartilhamento</FormLabel>
                    <FormDescription>
                      Permitir compartilhamento de imóveis em redes sociais
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
              name="enableBrokerProfiles"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Perfis de Corretores</FormLabel>
                    <FormDescription>
                      Exibir perfis públicos de corretores
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
              name="enableScheduleAppointment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Agendamento de Visitas</FormLabel>
                    <FormDescription>
                      Permitir agendamento online de visitas aos imóveis
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
