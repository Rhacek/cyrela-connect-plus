
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle } from "lucide-react";

interface ImageUploadButtonProps {
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploadButton = ({ uploading, onFileChange }: ImageUploadButtonProps) => {
  return (
    <label
      htmlFor="image-upload"
      className={`cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
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
        onChange={onFileChange}
        disabled={uploading}
      />
    </label>
  );
};
