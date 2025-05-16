
import { supabase } from "@/integrations/supabase/client";
import { PlanType } from "@/types";

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  type: PlanType;
  billingPeriod: "monthly" | "yearly";
  isActive: boolean;
  isMostPopular: boolean | null;
}

export const plansService = {
  async getAll(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price", { ascending: true });

    if (error) {
      console.error("Erro ao buscar planos:", error);
      throw error;
    }

    return data.map(mapDbPlanToClientPlan);
  },

  async getById(id: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Plano não encontrado
      }
      console.error("Erro ao buscar plano:", error);
      throw error;
    }

    return mapDbPlanToClientPlan(data);
  },

  async create(plan: Omit<Plan, "id">): Promise<Plan> {
    const { data, error } = await supabase
      .from("plans")
      .insert({
        name: plan.name,
        description: plan.description,
        price: plan.price,
        features: plan.features,
        type: plan.type,
        billing_period: plan.billingPeriod,
        is_active: plan.isActive,
        is_most_popular: plan.isMostPopular
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar plano:", error);
      throw error;
    }

    return mapDbPlanToClientPlan(data);
  },

  async update(id: string, plan: Partial<Omit<Plan, "id">>): Promise<Plan> {
    const updateData: any = {};

    if (plan.name !== undefined) updateData.name = plan.name;
    if (plan.description !== undefined) updateData.description = plan.description;
    if (plan.price !== undefined) updateData.price = plan.price;
    if (plan.features !== undefined) updateData.features = plan.features;
    if (plan.type !== undefined) updateData.type = plan.type;
    if (plan.billingPeriod !== undefined) updateData.billing_period = plan.billingPeriod;
    if (plan.isActive !== undefined) updateData.is_active = plan.isActive;
    if (plan.isMostPopular !== undefined) updateData.is_most_popular = plan.isMostPopular;

    const { data, error } = await supabase
      .from("plans")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar plano:", error);
      throw error;
    }

    return mapDbPlanToClientPlan(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir plano:", error);
      throw error;
    }
  }
};

// Função auxiliar para mapear o formato do banco para o formato do cliente
function mapDbPlanToClientPlan(dbPlan: any): Plan {
  return {
    id: dbPlan.id,
    name: dbPlan.name,
    description: dbPlan.description,
    price: dbPlan.price,
    features: dbPlan.features || [],
    type: dbPlan.type as PlanType || PlanType.FREE,
    billingPeriod: (dbPlan.billing_period || "monthly") as "monthly" | "yearly",
    isActive: dbPlan.is_active,
    isMostPopular: dbPlan.is_most_popular
  };
}
