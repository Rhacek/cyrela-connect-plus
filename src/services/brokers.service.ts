import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

export interface Broker {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  brokerCode: string | null;
  brokerage: string | null;
  status: "active" | "inactive";
  properties: number;
  clients: number;
  creci?: string | null;
}

export interface CreateBrokerData {
  name: string;
  email: string;
  phone: string;
  brokerCode: string;
  brokerage: string;
  status?: "active" | "inactive";
  creci?: string;
}

export const brokersService = {
  async getAll(): Promise<Broker[]> {
    // Get all users with the BROKER role
    const { data: brokers, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", UserRole.BROKER);

    if (error) {
      console.error("Error fetching brokers:", error);
      throw error;
    }

    // Fetch property counts for each broker
    const brokersWithStats = await Promise.all(
      brokers.map(async (broker) => {
        // Count properties created by this broker
        const { count: propertyCount, error: propertyError } = await supabase
          .from("properties")
          .select("id", { count: "exact", head: true })
          .eq("created_by_id", broker.id);

        // Count leads assigned to this broker
        const { count: leadCount, error: leadError } = await supabase
          .from("leads")
          .select("id", { count: "exact", head: true })
          .eq("assigned_to_id", broker.id);

        if (propertyError) {
          console.error("Error counting properties:", propertyError);
        }

        if (leadError) {
          console.error("Error counting leads:", leadError);
        }

        // Ensure status is strictly "active" or "inactive"
        const status: "active" | "inactive" = broker.broker_code ? "active" : "inactive";

        return {
          id: broker.id,
          name: broker.name,
          email: broker.email,
          phone: broker.phone,
          brokerCode: broker.broker_code,
          brokerage: broker.brokerage,
          status, // Now properly typed as "active" | "inactive"
          properties: propertyCount || 0,
          clients: leadCount || 0,
          creci: broker.creci
        };
      })
    );

    return brokersWithStats;
  },

  async getById(id: string): Promise<Broker | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", UserRole.BROKER)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No data found
        return null;
      }
      console.error("Error fetching broker:", error);
      throw error;
    }

    // Count properties
    const { count: propertyCount } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("created_by_id", data.id);

    // Count leads
    const { count: leadCount } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("assigned_to_id", data.id);

    // Ensure status is strictly "active" or "inactive"
    const status: "active" | "inactive" = data.broker_code ? "active" : "inactive";

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      brokerCode: data.broker_code,
      brokerage: data.brokerage,
      status,
      properties: propertyCount || 0,
      clients: leadCount || 0,
      creci: data.creci
    };
  },

  async update(id: string, brokerData: Partial<Broker>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: brokerData.name,
        phone: brokerData.phone,
        broker_code: brokerData.brokerCode,
        brokerage: brokerData.brokerage,
        creci: brokerData.creci
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating broker:", error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    // Note: Actual user deletion may require auth admin rights
    // This just updates the broker's status
    const { error } = await supabase
      .from("profiles")
      .update({
        broker_code: null,
        brokerage: null,
        creci: null
      })
      .eq("id", id);

    if (error) {
      console.error("Error deactivating broker:", error);
      throw error;
    }
  },

  async create(brokerData: CreateBrokerData): Promise<Broker | null> {
    try {
      // Generate a random temporary password (this will be changed by the user)
      const tempPassword = Math.random().toString(36).substring(2, 12);

      // Create the user in Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.admin.createUser({
        email: brokerData.email,
        password: tempPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          name: brokerData.name,
          role: UserRole.BROKER,
          brokerCode: brokerData.brokerCode,
          brokerage: brokerData.brokerage,
          creci: brokerData.creci
        }
      });

      if (authError) {
        console.error("Error creating broker user:", authError);
        throw authError;
      }

      if (!userData.user) {
        console.error("No user returned after creation");
        return null;
      }

      // The handle_new_user trigger in Supabase will automatically create the profile
      // But we need to wait a moment for it to happen
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return the new broker
      return {
        id: userData.user.id,
        name: brokerData.name,
        email: brokerData.email,
        phone: brokerData.phone,
        brokerCode: brokerData.brokerCode,
        brokerage: brokerData.brokerage,
        status: "active",
        properties: 0,
        clients: 0,
        creci: brokerData.creci
      };
    } catch (error) {
      console.error("Error in broker creation:", error);
      throw error;
    }
  }
};
