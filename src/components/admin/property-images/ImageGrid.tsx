
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { PropertyImage } from "@/types";
import { ImageCard } from "./ImageCard";

interface ImageGridProps {
  images: PropertyImage[];
  uploadProgress: Record<string, number>;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
  onDragEnd: (result: DropResult) => void;
}

export const ImageGrid = ({
  images,
  uploadProgress,
  onSetMain,
  onRemove,
  onDragEnd
}: ImageGridProps) => {
  if (images.length === 0) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                  <ImageCard
                    ref={provided.innerRef}
                    draggableProps={provided.draggableProps}
                    dragHandleProps={provided.dragHandleProps}
                    image={image}
                    uploadProgress={uploadProgress[image.id]}
                    isMain={image.isMain}
                    onSetMain={onSetMain}
                    onRemove={onRemove}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
