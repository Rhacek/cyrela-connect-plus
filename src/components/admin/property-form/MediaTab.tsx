
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { PropertyFormValues } from "./PropertyFormSchema";
import { PropertyImageUpload } from "@/components/admin/PropertyImageUpload";
import { PropertyImage } from "@/types";
import { useEffect, useState } from "react";
import { propertiesService } from "@/services/properties.service";

interface MediaTabProps {
  form: UseFormReturn<PropertyFormValues>;
  initialImages?: PropertyImage[];
  propertyId?: string;
}

export const MediaTab = ({ form, initialImages = [], propertyId }: MediaTabProps) => {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);

  useEffect(() => {
    if (propertyId) {
      // Fetch images if editing an existing property
      const fetchImages = async () => {
        try {
          const property = await propertiesService.getById(propertyId);
          if (property && property.images) {
            setImages(property.images);
          }
        } catch (error) {
          console.error("Error fetching property images:", error);
        }
      };
      
      fetchImages();
    }
  }, [propertyId]);

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
        
        <PropertyImageUpload 
          initialImages={images} 
          propertyId={propertyId}
        />
      </CardContent>
    </Card>
  );
};
