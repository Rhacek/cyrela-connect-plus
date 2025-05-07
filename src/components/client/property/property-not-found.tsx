
import { Button } from "@/components/ui/button";
import { PropertyHeader } from "@/components/client/property/property-header";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PropertyNotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-cyrela-gray-lightest">
      <PropertyHeader />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <p className="text-cyrela-gray-dark mb-8">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
          <Button 
            onClick={() => navigate("/client/results")}
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar para a busca
          </Button>
        </div>
      </div>
    </div>
  );
}
