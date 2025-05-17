
import { useState } from "react";
import { ShareHeader } from "@/components/broker/share/share-header";
import { ShareStatsGrid } from "@/components/broker/share/share-stats-grid";
import { ShareLinkTable } from "@/components/broker/share/share-link-table";
import { CreateShareLinkDialog } from "@/components/broker/share/create-share-link-dialog";
import { mockSharedLinks, mockShareStats, SharedLink } from "@/mocks/share-data";
import { toast } from "@/hooks/use-toast";

export default function BrokerShare() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>(mockSharedLinks);
  const [stats, setStats] = useState(mockShareStats);

  const handleCreateLink = (propertyId: string, notes?: string) => {
    // Find the property in the existing links to get property info
    const propertyInfo = sharedLinks.find(link => link.propertyId === propertyId)?.property;
    
    if (!propertyInfo) {
      toast.error("Erro ao criar link", {
        description: "Não foi possível encontrar o imóvel selecionado"
      });
      return;
    }
    
    // Generate a random code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create a new shared link
    const newLink: SharedLink = {
      id: `share-${Date.now()}`,
      brokerId: "broker-1",
      propertyId,
      property: propertyInfo,
      code,
      url: `https://living.com.br/s/${code}`,
      createdAt: new Date(),
      clicks: 0,
      isActive: true,
      notes,
    };
    
    // Add the new link to the state
    const updatedLinks = [newLink, ...sharedLinks];
    setSharedLinks(updatedLinks);
    
    // Update the stats
    const updatedStats = {
      ...stats,
      totalShares: stats.totalShares + 1,
      activeLinks: stats.activeLinks + 1,
      averageClicksPerShare: Math.round(
        stats.totalClicks / (stats.totalShares + 1)
      ),
    };
    setStats(updatedStats);
    
    toast.success("Link criado com sucesso!", {
      description: "O link foi criado e já está disponível para compartilhamento"
    });
  };

  return (
    <div className="w-full">
      <div className="container py-6 md:py-8 max-w-7xl mx-auto">
        <ShareHeader onCreateLink={() => setIsCreateDialogOpen(true)} />
        
        <ShareStatsGrid 
          totalShares={stats.totalShares}
          totalClicks={stats.totalClicks}
          activeLinks={stats.activeLinks}
          averageClicksPerShare={stats.averageClicksPerShare}
          mostSharedProperty={stats.mostSharedProperty}
        />
        
        <ShareLinkTable links={sharedLinks} />
        
        <CreateShareLinkDialog 
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateLink={handleCreateLink}
        />
      </div>
    </div>
  );
}
