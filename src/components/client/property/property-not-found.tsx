
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";

interface PropertyNotFoundProps {
  message?: string;
}

export function PropertyNotFound({ message = "Imóvel não encontrado" }: PropertyNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cyrela-gray-lightest p-4 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-cyrela-gray-lighter rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 text-cyrela-gray" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-cyrela-gray-dark mb-2">
          {message}
        </h1>
        <p className="text-cyrela-gray mb-6">
          O imóvel que você está procurando não foi encontrado ou não está mais disponível.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1"
            onClick={() => navigate('/client/results')}
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar imóveis
          </Button>
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/client/welcome')}
          >
            <Home className="mr-2 h-4 w-4" />
            Página inicial
          </Button>
        </div>
      </div>
    </div>
  );
}
