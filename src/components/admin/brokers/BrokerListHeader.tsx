
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, Target } from "lucide-react";

interface BrokerListHeaderProps {
  totalBrokers: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function BrokerListHeader({ 
  totalBrokers, 
  searchQuery, 
  onSearchChange 
}: BrokerListHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Corretores</h1>
        <p className="text-muted-foreground">
          {totalBrokers === 0
            ? "Nenhum corretor cadastrado."
            : totalBrokers === 1
            ? "1 corretor cadastrado."
            : `${totalBrokers} corretores cadastrados.`}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/brokers/targets/')}
          className="flex items-center gap-2"
        >
          <Target size={16} />
          <span>Gerenciar Metas</span>
        </Button>
        <Button onClick={() => navigate("/admin/brokers/new/")} className="flex items-center gap-2">
          <UserPlus size={16} />
          <span>Novo Corretor</span>
        </Button>
      </div>
    </div>
  );
}
