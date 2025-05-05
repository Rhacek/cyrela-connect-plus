
import { Search, Share, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAccessProps {
  className?: string;
}

export function QuickAccess({ className }: QuickAccessProps) {
  return (
    <div className={cn(
      "cyrela-card h-full animate-fade-in",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold font-poppins">Acesso rápido</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          className="flex justify-start p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/properties"}
        >
          <Search size={24} className="mr-4 flex-shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-base truncate font-poppins">Catálogo de imóveis</h3>
            <p className="text-cyrela-gray-dark text-sm line-clamp-1 font-inter">
              Explore os empreendimentos disponíveis
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/share"}
        >
          <Share size={24} className="mr-4 flex-shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-base truncate font-poppins">Compartilhar</h3>
            <p className="text-cyrela-gray-dark text-sm line-clamp-1 font-inter">
              Gere links personalizados para clientes
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/schedule"}
        >
          <Calendar size={24} className="mr-4 flex-shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-base truncate font-poppins">Agendamentos</h3>
            <p className="text-cyrela-gray-dark text-sm line-clamp-1 font-inter">
              Gerencie suas visitas e compromissos
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/profile"}
        >
          <Home size={24} className="mr-4 flex-shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-base truncate font-poppins">Meu perfil</h3>
            <p className="text-cyrela-gray-dark text-sm line-clamp-1 font-inter">
              Personalize sua página pública
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
