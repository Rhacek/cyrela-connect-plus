
import { supabase } from "@/integrations/supabase/client";

export type SettingsCategory = 'general' | 'email' | 'features';

export interface Setting<T = any> {
  id?: string;
  category: SettingsCategory;
  key: string;
  value: T;
  created_at?: string;
  updated_at?: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface EmailSettings {
  smtpServer: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
}

export interface FeatureSettings {
  enablePropertyComparisons: boolean;
  enableFavorites: boolean;
  enableReviews: boolean;
  enableShareFeature: boolean;
  enableBrokerProfiles: boolean;
  enableScheduleAppointment: boolean;
}

export const settingsService = {
  async getByCategory<T>(category: SettingsCategory): Promise<T> {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("category", category);

    if (error) {
      console.error(`Erro ao buscar configurações de ${category}:`, error);
      throw error;
    }

    // Transform array of settings into a single object
    return data.reduce((acc, setting) => {
      return {
        ...acc,
        [setting.key]: setting.value
      };
    }, {} as T);
  },

  async updateSetting(category: SettingsCategory, key: string, value: any): Promise<void> {
    const { error } = await supabase
      .from("settings")
      .update({ value })
      .eq("category", category)
      .eq("key", key);

    if (error) {
      console.error(`Erro ao atualizar configuração ${key}:`, error);
      throw error;
    }
  },

  async updateSettings<T>(category: SettingsCategory, settings: T): Promise<void> {
    // Batch update for all settings in a category
    const updates = Object.entries(settings).map(([key, value]) => {
      return this.updateSetting(category, key, value);
    });

    await Promise.all(updates);
  },

  async getGeneralSettings(): Promise<GeneralSettings> {
    return this.getByCategory("general") as Promise<GeneralSettings>;
  },

  async getEmailSettings(): Promise<EmailSettings> {
    return this.getByCategory("email") as Promise<EmailSettings>;
  },

  async getFeatureSettings(): Promise<FeatureSettings> {
    return this.getByCategory("features") as Promise<FeatureSettings>;
  },

  async updateGeneralSettings(settings: GeneralSettings): Promise<void> {
    return this.updateSettings("general", settings);
  },

  async updateEmailSettings(settings: EmailSettings): Promise<void> {
    return this.updateSettings("email", settings);
  },

  async updateFeatureSettings(settings: FeatureSettings): Promise<void> {
    return this.updateSettings("features", settings);
  }
};
