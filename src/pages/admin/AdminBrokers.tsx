
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { brokersService, Broker } from "@/services/brokers.service";

import { BrokerListHeader } from "@/components/admin/brokers/BrokerListHeader";
import { BrokerTableSkeleton } from "@/components/admin/brokers/BrokerTableSkeleton";
import { BrokerEmptyState } from "@/components/admin/brokers/BrokerEmptyState";
import { BrokerTable } from "@/components/admin/brokers/BrokerTable";

const AdminBrokers = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        setLoading(true);
        const data = await brokersService.getAll();
        setBrokers(data);
      } catch (error) {
        console.error("Error fetching brokers:", error);
        toast.error("Erro ao carregar os corretores", {
          description: "Tente novamente mais tarde."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, [toast]);

  const handleDeleteBroker = async (id: string) => {
    try {
      setDeletingId(id);
      await brokersService.delete(id);
      setBrokers(prevBrokers => 
        prevBrokers.map(broker => 
          broker.id === id 
            ? { ...broker, status: "inactive", brokerCode: null, brokerage: null } 
            : broker
        )
      );
      toast.success("Corretor desativado com sucesso");
    } catch (error) {
      console.error("Error deactivating broker:", error);
      toast.error("Erro ao desativar o corretor", {
        description: "Tente novamente mais tarde."
      });
    } finally {
      setDeletingId(null);
    }
  };
  
  const filteredBrokers = brokers.filter(
    broker => broker.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BrokerListHeader 
        totalBrokers={brokers.length}
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery}
      />
      
      <div className="rounded-md border w-full overflow-hidden">
        <div className="w-full overflow-x-auto">
          {loading ? (
            <BrokerTableSkeleton />
          ) : filteredBrokers.length > 0 ? (
            <BrokerTable 
              brokers={filteredBrokers}
              deletingId={deletingId}
              onDeleteBroker={handleDeleteBroker}
            />
          ) : (
            <BrokerEmptyState searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBrokers;
