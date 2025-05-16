
import { PropertyImage } from "@/types";
import { PropertyImageUploader } from "./property-images/PropertyImageUploader";

interface PropertyImageUploadProps {
  initialImages?: PropertyImage[];
  propertyId?: string;
}

export const PropertyImageUpload = (props: PropertyImageUploadProps) => {
  return <PropertyImageUploader {...props} />;
};
