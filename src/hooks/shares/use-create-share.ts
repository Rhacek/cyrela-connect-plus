
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreateShareParams {
  brokerId: string | undefined;
  propertyId: string;
  notes?: string;
}

/**
 * Hook to create a new share link
 */
export function useCreateShare() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ brokerId, propertyId, notes }: CreateShareParams) => {
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
    },
    onError: (error) => {
      console.error("Error creating share link:", error);
      toast.error("Erro ao criar link", {
        description: "Não foi possível criar o link de compartilhamento"
      });
    }
  });
}
