
import { Search, Share, Calendar, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickAccessProps {
  className?: string;
}

export function QuickAccess({ className }: QuickAccessProps) {
  return (
    <div className={cn(
      "cyrela-card h-full animate-fade-in p-3 sm:p-4",
      className
    )}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold font-poppins truncate">Acesso rápido</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Button
          className="flex justify-start p-2 sm:p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/properties"}
        >
          <Search size={18} className="sm:size-24 mr-2 sm:mr-4 shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-sm sm:text-base truncate font-poppins">Catálogo de imóveis</h3>
            <p className="text-cyrela-gray-dark text-xs sm:text-sm line-clamp-1 font-inter">
              Explore os empreendimentos
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-2 sm:p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/share"}
        >
          <Share size={18} className="sm:size-24 mr-2 sm:mr-4 shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-sm sm:text-base truncate font-poppins">Compartilhar</h3>
            <p className="text-cyrela-gray-dark text-xs sm:text-sm line-clamp-1 font-inter">
              Links personalizados
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-2 sm:p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/schedule"}
        >
          <Calendar size={18} className="sm:size-24 mr-2 sm:mr-4 shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-sm sm:text-base truncate font-poppins">Agendamentos</h3>
            <p className="text-cyrela-gray-dark text-xs sm:text-sm line-clamp-1 font-inter">
              Gerencie visitas
            </p>
          </div>
        </Button>
        
        <Button
          className="flex justify-start p-2 sm:p-4 h-auto bg-white text-primary border border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter hover-scale"
          onClick={() => window.location.href = "/broker/profile"}
        >
          <Home size={18} className="sm:size-24 mr-2 sm:mr-4 shrink-0" />
          <div className="text-left overflow-hidden">
            <h3 className="font-medium text-sm sm:text-base truncate font-poppins">Meu perfil</h3>
            <p className="text-cyrela-gray-dark text-xs sm:text-sm line-clamp-1 font-inter">
              Página pública
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
}
