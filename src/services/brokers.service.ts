
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

        return {
          id: broker.id,
          name: broker.name,
          email: broker.email,
          phone: broker.phone,
          brokerCode: broker.broker_code,
          brokerage: broker.brokerage,
          status: broker.broker_code ? "active" : "inactive", // Consider a broker active if they have a broker code
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

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      brokerCode: data.broker_code,
      brokerage: data.brokerage,
      status: data.broker_code ? "active" : "inactive",
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
  }
};
