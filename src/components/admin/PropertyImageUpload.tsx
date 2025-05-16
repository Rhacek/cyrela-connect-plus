
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { PropertyImage } from "@/types";
import { Image, PlusCircle, X, GripVertical, Loader2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/lib/supabase";
import { propertiesService } from "@/services/properties.service";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

interface PropertyImageUploadProps {
  initialImages?: PropertyImage[];
  propertyId?: string;
}

export const PropertyImageUpload = ({ initialImages = [], propertyId }: PropertyImageUploadProps) => {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);
  
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `property-images/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('properties')
      .upload(filePath, file);
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from('properties')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploading(true);
      const files = Array.from(e.target.files);
      const newProgress = { ...uploadProgress };
      
      // Create temporary image objects
      const tempImages: PropertyImage[] = files.map((file, index) => {
        const tempId = `temp-${Date.now()}-${index}`;
        newProgress[tempId] = 0;
        return {
          id: tempId,
          propertyId: propertyId || "temp",
          url: URL.createObjectURL(file),
          isMain: images.length === 0 && index === 0,
          order: images.length + index + 1,
          tempFile: file // Add tempFile to track the actual file
        };
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
            })))
        );
        
        toast({
          title: "Imagens carregadas com sucesso",
          description: `${uploadedImages.filter(Boolean).length} imagens foram adicionadas ao imóvel.`
        });
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar imagens",
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
        toast({
          title: "Imagem removida",
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
      toast({
        variant: "destructive",
        title: "Erro ao remover imagem",
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
            mainImageId: id
          });
        }
      }
    } catch (error) {
      console.error("Error setting main image:", error);
      toast({
        variant: "destructive",
        title: "Erro ao definir imagem principal",
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
        <label htmlFor="image-upload" className={`cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
            <span>{uploading ? "Carregando..." : "Adicionar imagens"}</span>
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        
        <p className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? "imagem" : "imagens"}
        </p>
      </div>
      
      {images.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="property-images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group rounded-md border overflow-hidden"
                      >
                        <div 
                          {...provided.dragHandleProps} 
                          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
                        </div>
                        
                        {image.isMain && (
                          <div className="absolute top-2 right-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded-md">
                            Capa
                          </div>
                        )}
                        
                        {/* Upload progress indicator */}
                        {uploadProgress[image.id] !== undefined && uploadProgress[image.id] < 100 && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {!image.isMain && (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => setMainImage(image.id)}
                            >
                              Definir como capa
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <AspectRatio ratio={4/3}>
                          <img 
                            src={image.url} 
                            alt={`Imóvel ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </AspectRatio>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {images.length === 0 && (
        <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
          <Image className="h-10 w-10 mb-2" />
          <p>Nenhuma imagem adicionada</p>
          <p className="text-xs mt-1">Arraste imagens aqui ou clique em "Adicionar imagens"</p>
        </div>
      )}
    </div>
  );
};
