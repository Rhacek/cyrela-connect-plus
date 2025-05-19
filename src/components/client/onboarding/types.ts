
import { ReactNode } from "react";

export interface OnboardingStepData {
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

export type OnboardingStep = React.ComponentType<any>;

export interface OnboardingFormData {
  objective: string;
  stage?: string;
  city: string;
  zone: string;
  neighborhoods: string[];
  bedrooms: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
}

// Step-specific props interfaces
export interface ObjectiveStepProps {
  value: string;
  onChange: (value: string) => void;
}

export interface StageStepProps {
  value: string;
  onChange: (value: string) => void;
}

export interface LocationStepProps {
  city: string;
  zone: string;
  neighborhoods: string[];
  onCityChange: (city: string) => void;
  onZoneChange: (zone: string) => void;
  onNeighborhoodsChange: (neighborhoods: string[]) => void;
}

export interface DetailsStepProps {
  bedrooms: string;
  budget: string;
  onBedroomsChange: (bedrooms: string) => void;
  onBudgetChange: (budget: string) => void;
}

export interface ContactStepProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

export interface ReviewStepProps {
  formData: OnboardingFormData;
}
