
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { GripVertical, Loader2, X } from "lucide-react";
import { PropertyImage } from "@/types";
import { forwardRef } from "react";

interface ImageCardProps {
  image: PropertyImage;
  uploadProgress?: number;
  draggableProps: any;
  dragHandleProps: any;
  isMain: boolean;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
}

export const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ image, uploadProgress, draggableProps, dragHandleProps, isMain, onSetMain, onRemove }, ref) => {
    return (
      <div
        ref={ref}
        {...draggableProps}
        className="relative group rounded-md border overflow-hidden"
      >
        <div 
          {...dragHandleProps} 
          className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-white drop-shadow-md" />
        </div>
        
        {isMain && (
          <div className="absolute top-2 right-2 z-10 bg-primary text-white text-xs px-2 py-1 rounded-md">
            Capa
          </div>
        )}
        
        {uploadProgress !== undefined && uploadProgress < 100 && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {!isMain && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => onSetMain(image.id)}
            >
              Definir como capa
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => onRemove(image.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <AspectRatio ratio={4/3}>
          <img 
            src={image.url} 
            alt="Imagem do imóvel" 
            className="w-full h-full object-cover"
          />
        </AspectRatio>
      </div>
    );
  }
);

ImageCard.displayName = "ImageCard";
