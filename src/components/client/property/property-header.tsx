
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import { Phone, Share, MessageSquare } from "lucide-react";

export function PropertyHeader() {
  return (
    <header className="bg-white border-b border-cyrela-gray-lighter sticky top-0 z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <AppLogo />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center text-cyrela-gray-dark"
            onClick={() => window.location.href = "/client/broker"}
          >
            <Phone size={16} className="mr-2 shrink-0" />
            <span className="hidden lg:inline">Falar com o corretor</span>
            <span className="lg:hidden">Corretor</span>
          </Button>
          
          <Button
            className="hidden md:flex items-center bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
            size="sm"
          >
            <Share size={16} className="mr-2 shrink-0" />
            <span className="hidden lg:inline">Compartilhar resultados</span>
            <span className="lg:hidden">Compartilhar</span>
          </Button>
          
          <Button
            className="md:hidden flex items-center bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white rounded-full p-2"
            size="icon"
          >
            <Share size={16} />
          </Button>
          
          <Button
            className="md:hidden flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
            size="icon"
          >
            <MessageSquare size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}
