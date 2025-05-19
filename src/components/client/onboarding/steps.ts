
import { OnboardingStepData } from "./types";
import { ObjectiveStep } from "./steps/ObjectiveStep";
import { StageStep } from "./steps/StageStep";
import { LocationStep } from "./steps/LocationStep";
import { DetailsStep } from "./steps/DetailsStep";
import { ContactStep } from "./steps/ContactStep";
import { ReviewStep } from "./steps/ReviewStep";

export const ONBOARDING_STEPS: OnboardingStepData[] = [
  {
    title: "Objetivo",
    description: "Conte-nos qual seu objetivo com o imóvel",
    component: ObjectiveStep
  },
  {
    title: "Estágio",
    description: "Qual estágio da obra você prefere?",
    component: StageStep
  },
  {
    title: "Localização",
    description: "Onde você deseja encontrar seu imóvel ideal?",
    component: LocationStep
  },
  {
    title: "Detalhes",
    description: "Informe-nos mais detalhes sobre o imóvel desejado",
    component: DetailsStep
  },
  {
    title: "Contato",
    description: "Complete seus dados para receber os resultados",
    component: ContactStep
  },
  {
    title: "Revisão",
    description: "Revise suas informações antes de finalizar",
    component: ReviewStep
  }
];
