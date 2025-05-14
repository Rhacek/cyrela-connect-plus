
import { PlanType } from "./index";

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly";
  features: string[];
  isMostPopular?: boolean;
  description?: string;
}

export const plans: Plan[] = [
  {
    id: "free-plan",
    type: PlanType.FREE,
    name: "Plano Gratuito",
    price: 0,
    billingPeriod: "monthly",
    features: [
      "Acesso básico à plataforma",
      "Limite de 5 imóveis salvos",
      "Atendimento por e-mail"
    ],
    description: "Ideal para quem está começando"
  },
  {
    id: "pro-plan",
    type: PlanType.PRO,
    name: "Plano Pro",
    price: 49.90,
    billingPeriod: "monthly",
    features: [
      "Acesso completo à plataforma",
      "Imóveis ilimitados",
      "Atendimento prioritário",
      "Relatórios avançados",
      "Ferramentas de marketing",
      "Acesso a leads premium"
    ],
    isMostPopular: true,
    description: "Perfeito para corretores ativos"
  }
];
