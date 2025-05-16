
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { PropertyImage } from "@/types";

// Extend PropertyImage to include tempFile for uploads
export interface ExtendedPropertyImage extends PropertyImage {
  tempFile?: File;
}

export const createTempImages = (
  files: File[], 
  currentImagesLength: number, 
  propertyId?: string
): ExtendedPropertyImage[] => {
  return files.map((file, index) => {
    const tempId = `temp-${Date.now()}-${index}`;
    
    return {
      id: tempId,
      propertyId: propertyId || "temp",
      url: URL.createObjectURL(file),
      isMain: currentImagesLength === 0 && index === 0,
      order: currentImagesLength + index + 1,
      tempFile: file // Add tempFile to track the actual file
    };
  });
};

export const uploadImage = async (file: File): Promise<string> => {
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
