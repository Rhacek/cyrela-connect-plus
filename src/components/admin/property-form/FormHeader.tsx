
import { useNavigate } from "react-router-dom";

interface FormHeaderProps {
  isEditing: boolean;
}

export const FormHeader = ({ isEditing }: FormHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
      </h1>
      <p className="text-muted-foreground mt-2">
        {isEditing 
          ? "Atualize as informações do imóvel conforme necessário." 
          : "Preencha as informações para cadastrar um novo imóvel."
        }
      </p>
    </div>
  );
};
