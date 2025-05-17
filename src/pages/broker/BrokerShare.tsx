
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ShareHeader } from "@/components/broker/share/share-header";
import { ShareStatsGrid } from "@/components/broker/share/share-stats-grid";
import { ShareLinkTable } from "@/components/broker/share/share-link-table";
import { CreateShareLinkDialog } from "@/components/broker/share/create-share-link-dialog";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SharedLink } from "@/mocks/share-data"; // Using type only, data will be from Supabase

interface ShareStats {
  totalShares: number;
  totalClicks: number;
  activeLinks: number;
  averageClicksPerShare: number;
  mostSharedProperty: {
    id: string;
    name: string;
    count: number;
  } | null;
}

export default function BrokerShare() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { session } = useAuth();
  const brokerId = session?.id;
  const queryClient = useQueryClient();
  
  // Fetch share links data from Supabase
  const { 
    data: sharedLinks = [],
    isLoading: isLoadingLinks, 
    error: linksError
  } = useQuery({
    queryKey: ['brokerShares', brokerId],
    queryFn: async () => {
      try {
        if (!brokerId) return [];
        
        const { data, error } = await supabase
          .from('shares')
          .select(`
            id, code, url, created_at, clicks, is_active, notes, last_clicked_at, expires_at,
            property_id, broker_id,
            properties:property_id (title, development_name)
          `)
          .eq('broker_id', brokerId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data.map((share: any): SharedLink => ({
          id: share.id,
          brokerId: share.broker_id,
          propertyId: share.property_id,
          property: {
            id: share.property_id,
            title: share.properties?.title || "Imóvel sem título",
            developmentName: share.properties?.development_name || ""
          },
          code: share.code,
          url: share.url,
          createdAt: new Date(share.created_at),
          clicks: share.clicks,
          isActive: share.is_active,
          notes: share.notes,
          lastClickedAt: share.last_clicked_at ? new Date(share.last_clicked_at) : undefined,
          expiresAt: share.expires_at ? new Date(share.expires_at) : undefined
        }));
      } catch (err) {
        console.error("Error fetching share links:", err);
        throw err;
      }
    },
    enabled: !!brokerId
  });
  
  // Fetch share stats from Supabase
  const { 
    data: stats = {
      totalShares: 0,
      totalClicks: 0,
      activeLinks: 0,
      averageClicksPerShare: 0,
      mostSharedProperty: null
    },
    isLoading: isLoadingStats, 
    error: statsError
  } = useQuery({
    queryKey: ['brokerShareStats', brokerId],
    queryFn: async () => {
      try {
        if (!brokerId) return {
          totalShares: 0,
          totalClicks: 0,
          activeLinks: 0,
          averageClicksPerShare: 0,
          mostSharedProperty: null
        };
        
        const { data, error } = await supabase
          .rpc('get_broker_share_stats', { broker_id: brokerId });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
          return {
            totalShares: 0,
            totalClicks: 0,
            activeLinks: 0,
            averageClicksPerShare: 0,
            mostSharedProperty: null
          };
        }
        
        return {
          totalShares: data[0].total_shares || 0,
          totalClicks: data[0].total_clicks || 0,
          activeLinks: data[0].active_links || 0,
          averageClicksPerShare: data[0].average_clicks_per_share || 0,
          mostSharedProperty: data[0].most_shared_property || null
        };
      } catch (err) {
        console.error("Error fetching share stats:", err);
        throw err;
      }
    },
    enabled: !!brokerId
  });
  
  // Show error toast if data fetch fails
  useEffect(() => {
    if (linksError || statsError) {
      console.error("Error fetching share data:", linksError || statsError);
      toast.error("Não foi possível carregar os dados de compartilhamento");
    }
  }, [linksError, statsError]);
  
  // Mutation for creating new share link
  const createShareLink = useMutation({
    mutationFn: async ({ propertyId, notes }: { propertyId: string, notes?: string }) => {
      if (!brokerId) throw new Error("Broker ID not found");
      
      // Generate a random code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const url = `https://living.com.br/s/${code}`;
      
      const { data, error } = await supabase
        .from('shares')
        .insert({
          broker_id: brokerId,
          property_id: propertyId,
          code,
          url,
          notes,
          is_active: true
        })
        .select(`
          id, code, url, created_at, clicks, is_active, notes,
          property_id, broker_id,
          properties:property_id (title, development_name)
        `)
        .single();
      
      if (error) throw error;
      
      // Increment property share count
      await supabase.rpc('increment_property_shares', { property_id: propertyId });
      
      return data;
    },
    onSuccess: () => {
      toast.success("Link criado com sucesso!", {
        description: "O link foi criado e já está disponível para compartilhamento"
      });
      queryClient.invalidateQueries({ queryKey: ['brokerShares'] });
      queryClient.invalidateQueries({ queryKey: ['brokerShareStats'] });
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating share link:", error);
      toast.error("Erro ao criar link", {
        description: "Não foi possível criar o link de compartilhamento"
      });
    }
  });

  const handleCreateLink = (propertyId: string, notes?: string) => {
    createShareLink.mutate({ propertyId, notes });
  };

  return (
    <div className="w-full">
      <div className="container py-6 md:py-8 max-w-7xl mx-auto">
        <ShareHeader onCreateLink={() => setIsCreateDialogOpen(true)} />
        
        {isLoadingStats ? (
          <div className="cyrela-card p-6 flex items-center justify-center h-32 mb-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
              <p className="mt-2 text-cyrela-gray-dark">Carregando estatísticas...</p>
            </div>
          </div>
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
          <div className="cyrela-card p-6 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
              <p className="mt-2 text-cyrela-gray-dark">Carregando links compartilhados...</p>
            </div>
          </div>
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
