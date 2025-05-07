import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, SortDesc } from "lucide-react";
interface PropertySearchBarProps {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: (isOpen: boolean) => void;
}
export function PropertySearchBar({
  isMobileFilterOpen,
  setIsMobileFilterOpen
}: PropertySearchBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  return <div className={`bg-cyrela-blue text-white sticky top-[69px] z-10 transition-transform duration-300 ease-in-out ${isVisible ? 'transform translate-y-0' : 'transform -translate-y-full'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={18} />
            <input type="text" placeholder="Buscar por localização, empreendimento ou características" className="w-full pl-10 pr-4 py-2 rounded-md border border-cyrela-gray-lighter focus:outline-none focus:ring-2 focus:ring-cyrela-blue focus:border-transparent text-black" />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)} className="flex-1 md:flex-none bg-white text-cyrela-blue border-white hover:bg-cyrela-gray-lighter font-medium text-slate-400">
              {isMobileFilterOpen ? <>
                  <X size={16} className="mr-2 shrink-0" />
                  <span className="font-medium">Fechar filtros</span>
                </> : <>
                  <Filter size={16} className="mr-2 shrink-0" />
                  <span className="font-medium text-slate-400">Filtros</span>
                </>}
            </Button>
            
            <Button className="flex-1 md:flex-none bg-white text-cyrela-blue border-white hover:bg-cyrela-gray-lighter font-medium text-slate-300">
              <SortDesc size={16} className="mr-2 shrink-0" />
              <span className="font-medium text-slate-300">Ordenar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>;
}