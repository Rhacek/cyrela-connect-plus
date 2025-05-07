
export interface OnboardingStep {
  title: string;
  description: string;
}

export interface OnboardingFormData {
  objective: string;
  stage: string;
  city: string;
  zone: string;
  neighborhoods: string[];
  bedrooms: string;
  budget: string;
  name: string;
  email: string;
  phone: string;
}
