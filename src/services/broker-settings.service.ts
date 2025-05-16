
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/auth-context";

export type BrokerSettingsCategory = 'profile' | 'notifications';

export interface BrokerProfileSettings {
  showPhone: boolean;
  showEmail: boolean;
  showSocialMedia: boolean;
  autoReplyToLeads: boolean;
  leadNotificationEmail: string;
}

export interface BrokerNotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notifyOnNewLead: boolean;
  notifyOnPropertyView: boolean;
  notifyOnShareClick: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const brokerSettingsService = {
  async getBrokerSettings<T>(category: BrokerSettingsCategory): Promise<T> {
    const { session } = useAuth();
    if (!session) throw new Error("Usuário não autenticado");

    const { data, error } = await supabase
      .from("broker_settings")
      .select("*")
      .eq("broker_id", session.user.id)
      .eq("category", category)
      .single();

    if (error) {
      console.error(`Erro ao buscar configurações de ${category}:`, error);
      throw error;
    }

    return data?.settings as T;
  },

  async updateBrokerSettings<T>(category: BrokerSettingsCategory, settings: T): Promise<void> {
    const { session } = useAuth();
    if (!session) throw new Error("Usuário não autenticado");

    const { data, error: getError } = await supabase
      .from("broker_settings")
      .select("id")
      .eq("broker_id", session.user.id)
      .eq("category", category)
      .single();

    if (getError && getError.code !== 'PGRST116') {
      console.error(`Erro ao verificar configurações existentes:`, getError);
      throw getError;
    }

    if (data?.id) {
      // Update existing settings
      const { error } = await supabase
        .from("broker_settings")
        .update({ settings })
        .eq("id", data.id);

      if (error) {
        console.error(`Erro ao atualizar configurações de ${category}:`, error);
        throw error;
      }
    } else {
      // Insert new settings
      const { error } = await supabase
        .from("broker_settings")
        .insert({
          broker_id: session.user.id,
          category,
          settings
        });

      if (error) {
        console.error(`Erro ao criar configurações de ${category}:`, error);
        throw error;
      }
    }
  },

  async getBrokerProfileSettings(): Promise<BrokerProfileSettings> {
    try {
      return await this.getBrokerSettings<BrokerProfileSettings>("profile");
    } catch (error) {
      // Return default settings if not found
      return {
        showPhone: true,
        showEmail: true,
        showSocialMedia: true,
        autoReplyToLeads: true,
        leadNotificationEmail: "",
      };
    }
  },

  async getBrokerNotificationSettings(): Promise<BrokerNotificationSettings> {
    try {
      return await this.getBrokerSettings<BrokerNotificationSettings>("notifications");
    } catch (error) {
      // Return default settings if not found
      return {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notifyOnNewLead: true,
        notifyOnPropertyView: true,
        notifyOnShareClick: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
      };
    }
  },

  async updateBrokerProfileSettings(settings: BrokerProfileSettings): Promise<void> {
    return this.updateBrokerSettings("profile", settings);
  },

  async updateBrokerNotificationSettings(settings: BrokerNotificationSettings): Promise<void> {
    return this.updateBrokerSettings("notifications", settings);
  }
};
