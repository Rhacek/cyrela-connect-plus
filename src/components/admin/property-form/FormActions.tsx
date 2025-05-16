
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

export const FormActions = ({ isSubmitting, isEditing }: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end gap-4 mt-8">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/admin/properties")}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? "Atualizando..." : "Cadastrando..."}
          </>
        ) : (
          isEditing ? "Atualizar Imóvel" : "Cadastrar Imóvel"
        )}
      </Button>
    </div>
  );
};
