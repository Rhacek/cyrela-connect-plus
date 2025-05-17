
import { useState, useEffect } from "react";
import { User, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProfileImageUploadProps {
  currentImage?: string;
  isEditing: boolean;
  onImageChange: (image: File | null) => void;
  className?: string;
}

export function ProfileImageUpload({
  currentImage,
  isEditing,
  onImageChange,
  className
}: ProfileImageUploadProps) {
  const { session } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  
  // Try to get profile image from session if not provided
  useEffect(() => {
    if (!currentImage && session?.user_metadata?.profile_image) {
      setPreviewUrl(session.user_metadata.profile_image);
    }
  }, [currentImage, session]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    }
  };
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-cyrela-gray-lighter flex items-center justify-center">
          {previewUrl ? (
            <OptimizedImage
              src={previewUrl} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover"
              fallbackComponent={<User size={64} className="text-cyrela-gray-dark" />}
            />
          ) : (
            <User size={64} className="text-cyrela-gray-dark" />
          )}
        </div>
        
        {isEditing && (
          <label 
            htmlFor="profile-image-upload" 
            className="absolute bottom-0 right-0 bg-cyrela-blue text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-opacity-90 transition-all"
          >
            <PencilLine size={16} />
            <input 
              type="file" 
              id="profile-image-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
      
      {isEditing && (
        <p className="text-xs text-cyrela-gray-dark mt-2">
          Clique no ícone para alterar a foto
        </p>
      )}
    </div>
  );
}
