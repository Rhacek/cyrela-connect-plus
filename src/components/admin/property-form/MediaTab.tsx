
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./PropertyFormSchema";
import { PropertyImageUpload } from "@/components/admin/PropertyImageUpload";
import { PropertyImage } from "@/types";

interface MediaTabProps {
  form: UseFormReturn<PropertyFormValues>;
  initialImages?: PropertyImage[];
}

export const MediaTab = ({ form, initialImages = [] }: MediaTabProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-medium">Imagens do Imóvel</h3>
        <p className="text-sm text-muted-foreground">
          Adicione fotos do imóvel. A primeira imagem será utilizada como capa.
        </p>
        
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Vídeo (YouTube)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ex: https://www.youtube.com/watch?v=abc123" 
                />
              </FormControl>
              <FormDescription>
                Adicione o link do vídeo do YouTube para promover o imóvel
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <PropertyImageUpload initialImages={initialImages} />
      </CardContent>
    </Card>
  );
};
