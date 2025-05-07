
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/types";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  property: Property;
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const imageCount = property.images.length;
  
  // If we have only one image, duplicate it to avoid carousel issues
  const images = imageCount === 1 
    ? [property.images[0], property.images[0]] 
    : property.images;
  
  // For development purposes, use placeholder images if we have few images
  const placeholderImages = [
    "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg"
  ];
  
  const allImages = images.length < 3 
    ? [...images.map(img => img.url), ...placeholderImages.slice(0, 3 - images.length)]
    : images.map(img => img.url);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Main Image Carousel */}
      <Carousel className="w-full">
        <CarouselContent>
          {allImages.map((imageUrl, index) => (
            <CarouselItem key={index} className="relative">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={`${property.title} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {index + 1} / {allImages.length}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
        <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
      </Carousel>
      
      {/* Thumbnail Navigation */}
      <div className="flex overflow-x-auto gap-2 p-2 bg-cyrela-gray-lightest">
        {allImages.map((imageUrl, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2",
              currentImage === index
                ? "border-cyrela-blue"
                : "border-transparent"
            )}
          >
            <img
              src={imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
