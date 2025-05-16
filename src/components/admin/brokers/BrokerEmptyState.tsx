
import { Link } from "react-router-dom";
import { Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrokerEmptyStateProps {
  searchQuery: string;
}

export const BrokerEmptyState = ({ searchQuery }: BrokerEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <User size={48} className="mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium">Nenhum corretor encontrado</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        {searchQuery ? 
          "Não encontramos corretores com os critérios de busca informados." : 
          "Não há corretores cadastrados no sistema."}
      </p>
      <Button asChild>
        <Link to="/admin/brokers/new">
          <Plus size={18} className="mr-2" />
          Adicionar corretor
        </Link>
      </Button>
    </div>
  );
};
