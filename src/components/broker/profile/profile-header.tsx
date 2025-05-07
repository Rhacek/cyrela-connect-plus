
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface ProfileHeaderProps {
  title: string;
  description: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export function ProfileHeader({
  title,
  description,
  isEditing,
  onEdit,
  onSave,
  onCancel
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="max-w-2xl">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-cyrela-blue truncate">{title}</h1>
        <p className="text-cyrela-gray-dark text-xs sm:text-sm md:text-base line-clamp-2">
          {description}
        </p>
      </div>
      
      <div className="flex gap-2 self-start sm:self-center">
        {isEditing ? (
          <>
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap text-xs sm:text-sm py-1.5 px-3 h-auto"
              onClick={onSave}
            >
              <Save size={14} className="sm:size-16 mr-1.5 sm:mr-2" />
              Salvar alterações
            </Button>
            <Button 
              variant="outline"
              className="text-cyrela-gray-dark whitespace-nowrap text-xs sm:text-sm py-1.5 px-3 h-auto"
              onClick={onCancel}
            >
              <X size={14} className="sm:size-16 mr-1.5 sm:mr-2" />
              Cancelar
            </Button>
          </>
        ) : (
          <Button 
            variant="outline"
            className="text-cyrela-blue whitespace-nowrap self-start sm:self-center text-xs sm:text-sm py-1.5 px-3 h-auto"
            onClick={onEdit}
          >
            <Edit size={14} className="sm:size-16 mr-1.5 sm:mr-2" />
            Editar perfil
          </Button>
        )}
      </div>
    </div>
  );
}
