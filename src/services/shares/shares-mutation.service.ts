import { nanoid } from "nanoid";
import { supabase } from "@/integrations/supabase/client";
import { mapFromDbModel, mapToDbModel } from "./shares-mapper.service";
import { CreateShareParams, SharedLink } from "./shares-types";
import { brokerSettingsService } from "../broker-settings.service";

export const sharesMutationService = {
  async createShareLink(params: CreateShareParams): Promise<SharedLink> {
    try {
      // Get broker share settings
      const shareSettings = await brokerSettingsService.getBrokerShareSettings();
      
      // Generate a unique code for the share
      const code = nanoid(8);
      
      // Calculate expiration date if enabled in settings
      let expiresAt = null;
      if (shareSettings.defaultExpirationEnabled) {
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + shareSettings.defaultExpirationDays);
        expiresAt = expDate.toISOString();
      }
      
      // Generate URL based on share mode setting
      let url = `${window.location.origin}/p/${params.propertyId}?ref=${code}`;
      
      // Add UTM parameters if enabled
      if (shareSettings.appendUTMParameters) {
        url += `&utm_source=broker_share&utm_medium=link&utm_campaign=property_${params.propertyId}`;
      }
      
      // Auto-generate notes if enabled
      const notes = shareSettings.autoGenerateNotes 
        ? `Link compartilhado em ${new Date().toLocaleDateString('pt-BR')}`
        : params.notes;

      const { data, error } = await supabase
        .from("shares")
        .insert({
          broker_id: params.brokerId,
          property_id: params.propertyId,
          code,
          url,
          expires_at: expiresAt,
          clicks: 0,
          is_active: true,
          notes
        })
        .select("*, properties(*)")
        .single();

      if (error) throw error;

      // Call increment_property_shares function
      await supabase.rpc("increment_property_shares", {
        property_id: params.propertyId
      });

      return mapFromDbModel(data);
    } catch (error) {
      console.error("Error creating share link:", error);
      throw error;
    }
  },

  async deactivateShareLink(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("shares")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deactivating share link:", error);
      throw error;
    }
  }
};
