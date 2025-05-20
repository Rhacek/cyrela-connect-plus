import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageCardProps {
  imageUrl: string;
  imageId: string;
  propertyId: string;
  isMain?: boolean;
  onDelete: (imageId: string) => void;
  onSetMainImage: (imageId: string) => void;
}

export function ImageCard({
  imageUrl,
  imageId,
  propertyId,
  isMain = false,
  onDelete,
  onSetMainImage,
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  // Função para obter URL pública da imagem do Supabase
  const getPublicUrl = (url: string) => {
    // Se a URL já for completa, retorna ela mesma
    if (url.startsWith('http')) {
      return url;
    }
    
    // Se for um caminho do storage do Supabase, constrói a URL pública
    try {
      const { data } = supabase.storage.from('property-images').getPublicUrl(url);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return url;
    }
  };

  // Função para lidar com erro de carregamento da imagem
  const handleImageError = () => {
    setImageError(true);
    console.error(`Failed to load image: ${imageUrl}`);
  };

  // Função para excluir a imagem
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(imageId);
      toast({
        title: "Imagem excluída",
        description: "A imagem foi excluída com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Erro ao excluir imagem",
        description: "Ocorreu um erro ao excluir a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para definir como imagem principal
  const handleSetMainImage = async () => {
    if (isMain) return;
    
    try {
      setIsLoading(true);
      await onSetMainImage(imageId);
      toast({
        title: "Imagem principal definida",
        description: "A imagem foi definida como principal com sucesso.",
      });
    } catch (error) {
      console.error("Error setting main image:", error);
      toast({
        title: "Erro ao definir imagem principal",
        description: "Ocorreu um erro ao definir a imagem principal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determinar a URL final da imagem com fallback
  const finalImageUrl = imageError 
    ? "https://placehold.co/600x400?text=Imagem+Indisponível" 
    : getPublicUrl(imageUrl);

  return (
    <Card className={`overflow-hidden ${isMain ? 'ring-2 ring-primary' : ''}`}>
      <AspectRatio ratio={4 / 3}>
        <img
          src={finalImageUrl}
          alt="Imagem do imóvel"
          className="object-cover w-full h-full"
          onError={handleImageError}
        />
      </AspectRatio>
      <CardContent className="p-2">
        <div className="flex justify-between items-center">
          <Button
            variant={isMain ? "default" : "outline"}
            size="sm"
            onClick={handleSetMainImage}
            disabled={isLoading || isMain}
            className="text-xs"
          >
            {isMain ? "Principal" : "Definir como principal"}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
