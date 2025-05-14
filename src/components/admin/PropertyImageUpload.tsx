
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import { PropertyImage } from "@/types";
import { Image, PlusCircle, X, GripVertical } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PropertyImageUploadProps {
  initialImages?: PropertyImage[];
}

export const PropertyImageUpload = ({ initialImages = [] }: PropertyImageUploadProps) => {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: PropertyImage[] = Array.from(e.target.files).map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        propertyId: "temp",
        url: URL.createObjectURL(file),
        isMain: images.length === 0 && index === 0,
        order: images.length + index + 1
      }));
      
      setImages([...images, ...newImages]);
    }
  };
  
  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };
  
  const setMainImage = (id: string) => {
    setImages(
      images.map(img => ({
        ...img,
        isMain: img.id === id
      }))
    );
  };
  
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setImages(items.map((item, index) => ({
      ...item,
      order: index + 1
    })));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 rounded-md bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 transition-colors">
            <PlusCircle size={18} />
            <span>Adicionar imagens</span>
          </div>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
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
