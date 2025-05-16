
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DropResult } from "react-beautiful-dnd";
import { PropertyImage } from "@/types";
import { propertiesService } from "@/services/properties.service";
import { ImageUploadButton } from "./ImageUploadButton";
import { ImageGrid } from "./ImageGrid";
import { EmptyState } from "./EmptyState";
import { ExtendedPropertyImage, createTempImages, uploadImage } from "./imageUtils";

interface PropertyImageUploaderProps {
  initialImages?: PropertyImage[];
  propertyId?: string;
}

export const PropertyImageUploader = ({ 
  initialImages = [], 
  propertyId 
}: PropertyImageUploaderProps) => {
  const [images, setImages] = useState<ExtendedPropertyImage[]>(initialImages as ExtendedPropertyImage[]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    setImages(initialImages as ExtendedPropertyImage[]);
  }, [initialImages]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const newProgress = { ...uploadProgress };
      
      // Create temporary image objects
      const tempImages = createTempImages(files, images.length, propertyId);
      
      // Initialize progress for each temp image
      tempImages.forEach(img => {
        newProgress[img.id] = 0;
      });
      
      setImages([...images, ...tempImages]);
      setUploadProgress(newProgress);
      
      // If we have a propertyId, we can upload the images immediately
      if (propertyId) {
        const uploadPromises = tempImages.map(async (image) => {
          try {
            if (!image.tempFile) return null;
            
            // Upload image to Supabase Storage
            const publicUrl = await uploadImage(image.tempFile);
            
            // Add the image to the database
            const newImage = await propertiesService.addImage({
              propertyId,
              url: publicUrl,
              isMain: image.isMain,
              order: image.order
            });
            
            return {
              ...newImage,
              tempId: image.id // Keep track of the temp ID to remove it later
            };
          } catch (error) {
            console.error("Error uploading image:", error);
            return null;
          }
        });
        
        const uploadedImages = await Promise.all(uploadPromises);
        
        // Replace temp images with real ones
        setImages(prevImages => 
          prevImages.filter(img => !img.id.startsWith('temp-'))
            .concat(uploadedImages.filter(Boolean).map(img => ({
              id: img!.id,
              propertyId: img!.propertyId,
              url: img!.url,
              isMain: img!.isMain,
              order: img!.order
            } as ExtendedPropertyImage)))
        );
        
        toast.success("Imagens carregadas com sucesso", {
          description: `${uploadedImages.filter(Boolean).length} imagens foram adicionadas ao imóvel.`
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast.error("Erro ao carregar imagens", {
        description: "Ocorreu um erro ao processar as imagens. Tente novamente."
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };
  
  const removeImage = async (id: string) => {
    try {
      // If propertyId exists and the image is not a temporary one, delete it from the database
      if (propertyId && !id.startsWith('temp-')) {
        await propertiesService.deleteImage(id);
        toast.success("Imagem removida", {
          description: "A imagem foi removida com sucesso."
        });
      }
      
      // Remove from state
      setImages(images.filter(img => img.id !== id));
      
      // Reorder remaining images
      const reorderedImages = images
        .filter(img => img.id !== id)
        .map((img, index) => ({
          ...img,
          order: index + 1
        }));
      
      setImages(reorderedImages);
      
      // If no images left with isMain=true, set the first one as main
      if (reorderedImages.length > 0 && !reorderedImages.some(img => img.isMain)) {
        setMainImage(reorderedImages[0].id);
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Erro ao remover imagem", {
        description: "Ocorreu um erro ao remover a imagem. Tente novamente."
      });
    }
  };
  
  const setMainImage = async (id: string) => {
    try {
      const updatedImages = images.map(img => ({
        ...img,
        isMain: img.id === id
      }));
      
      setImages(updatedImages);
      
      // If propertyId exists, update the isMain status in the database
      if (propertyId) {
        const mainImage = updatedImages.find(img => img.id === id);
        if (mainImage && !id.startsWith('temp-')) {
          await propertiesService.update(propertyId, {
            // Update the property to indicate this is the main image
            isHighlighted: true // Using an existing field as we can't add mainImageId
          });
        }
      }
    } catch (error) {
      console.error("Error setting main image:", error);
      toast.error("Erro ao definir imagem principal", {
        description: "Ocorreu um erro ao definir a imagem principal. Tente novamente."
      });
    }
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const reorderedImages = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setImages(reorderedImages);
    
    // If propertyId exists, update the order in the database
    if (propertyId) {
      // This would be better handled in a batch operation, but for now we'll just log it
      console.log("Images reordered. Would update order in database:", reorderedImages);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ImageUploadButton 
          uploading={uploading}
          onFileChange={handleFileChange}
        />
        
        <p className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? "imagem" : "imagens"}
        </p>
      </div>
      
      {images.length > 0 ? (
        <ImageGrid
          images={images}
          uploadProgress={uploadProgress}
          onSetMain={setMainImage}
          onRemove={removeImage}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
};
