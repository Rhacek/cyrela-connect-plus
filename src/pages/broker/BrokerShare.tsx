
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { ShareHeader } from "@/components/broker/share/share-header";
import { ShareStatsGrid } from "@/components/broker/share/share-stats-grid";
import { ShareLinkTable } from "@/components/broker/share/share-link-table";
import { CreateShareLinkDialog } from "@/components/broker/share/create-share-link-dialog";
import { useAuth } from "@/context/auth-context";
import { ShareLoading } from "@/components/broker/share/share-loading";
import { useBrokerShares } from "@/hooks/use-broker-shares";

export default function BrokerShare() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { session } = useAuth();
  const brokerId = session?.id;
  
  const {
    sharedLinks,
    isLoadingLinks,
    linksError,
    stats,
    isLoadingStats,
    statsError,
    createShareLink,
  } = useBrokerShares(brokerId);
  
  // Show error toast if data fetch fails
  useEffect(() => {
    if (linksError || statsError) {
      console.error("Error fetching share data:", linksError || statsError);
      toast.error("Não foi possível carregar os dados de compartilhamento");
    }
  }, [linksError, statsError]);

  const handleCreateLink = (propertyId: string, notes?: string) => {
    createShareLink.mutate({ propertyId, notes });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="w-full">
      <div className="container py-6 md:py-8 max-w-7xl mx-auto">
        <ShareHeader onCreateLink={() => setIsCreateDialogOpen(true)} />
        
        {isLoadingStats ? (
          <ShareLoading message="Carregando estatísticas..." />
        ) : (
          <ShareStatsGrid 
            totalShares={stats.totalShares}
            totalClicks={stats.totalClicks}
            activeLinks={stats.activeLinks}
            averageClicksPerShare={stats.averageClicksPerShare}
            mostSharedProperty={stats.mostSharedProperty}
          />
        )}
        
        {isLoadingLinks ? (
          <ShareLoading message="Carregando links compartilhados..." />
        ) : (
          <ShareLinkTable links={sharedLinks} />
        )}
        
        <CreateShareLinkDialog 
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateLink={handleCreateLink}
        />
      </div>
    </div>
  );
}
