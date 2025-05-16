
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrokerSearchBar } from "./BrokerSearchBar";

interface BrokerListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const BrokerListHeader = ({ searchQuery, onSearchChange }: BrokerListHeaderProps) => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Corretores</h1>
        <p className="text-muted-foreground mt-2">Gerencie todos os corretores do sistema.</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <BrokerSearchBar 
          searchQuery={searchQuery} 
          onSearchChange={onSearchChange} 
        />
        
        <Button asChild>
          <Link to="/admin/brokers/new">
            <Plus size={18} className="mr-2" />
            Novo Corretor
          </Link>
        </Button>
      </div>
    </>
  );
};
