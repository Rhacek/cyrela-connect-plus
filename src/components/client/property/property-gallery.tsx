import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyGalleryProps {
  images: Array<{ id: string; url: string; isMain?: boolean }>;
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  // Função para obter URLs de imagens com fallback
  const getImageUrls = () => {
    if (images && images.length > 0) {
      // Filtra imagens com URLs válidas
      const validImages = images.filter(img => img.url && img.url.trim() !== '');
      
      if (validImages.length > 0) {
        // Ordena para que a imagem principal apareça primeiro
        return validImages.sort((a, b) => (a.isMain ? -1 : b.isMain ? 1 : 0));
      }
    }
    
    // Fallback para imagens padrão
    return [
      { id: 'default1', url: "https://placehold.co/800x600?text=Imóvel+Cyrela" },
      { id: 'default2', url: "https://placehold.co/800x600?text=Sem+Imagem" }
    ];
  };

  const galleryImages = getImageUrls();
  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1, 5); // Limita a 4 thumbnails

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/800x600?text=Imagem+Indisponível";
  };

  return (
    <div className="space-y-2">
      {/* Imagem principal */}
      <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-lg">
        <img
          src={mainImage.url}
          alt="Imagem principal do imóvel"
          className="object-cover w-full h-full"
          onError={handleImageError}
        />
      </AspectRatio>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {thumbnails.map((image) => (
            <AspectRatio key={image.id} ratio={1} className="bg-muted overflow-hidden rounded-lg">
              <img
                src={image.url}
                alt="Imagem do imóvel"
                className="object-cover w-full h-full"
                onError={handleImageError}
              />
            </AspectRatio>
          ))}
        </div>
      )}
    </div>
  );
}
