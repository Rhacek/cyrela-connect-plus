
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ShareHeaderProps {
  onCreateLink: () => void;
}

export function ShareHeader({ onCreateLink }: ShareHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-poppins tracking-tight">Compartilhar</h1>
          <p className="text-muted-foreground mt-1 font-inter">
            Crie e gerencia links personalizados para compartilhar seus imóveis
          </p>
        </div>
        <Button 
          onClick={onCreateLink} 
          className="mt-4 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Link
        </Button>
      </div>
    </div>
  );
}
