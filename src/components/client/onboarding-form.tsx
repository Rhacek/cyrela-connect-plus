
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Objetivo",
    description: "Conte-nos qual seu objetivo com o imóvel"
  },
  {
    title: "Estágio",
    description: "Qual estágio da obra você prefere?"
  },
  {
    title: "Localização",
    description: "Onde você deseja encontrar seu imóvel ideal?"
  },
  {
    title: "Detalhes",
    description: "Informe-nos mais detalhes sobre o imóvel desejado"
  },
  {
    title: "Contato",
    description: "Complete seus dados para receber os resultados"
  },
  {
    title: "Revisão",
    description: "Revise suas escolhas antes de finalizar"
  }
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    objective: "",
    stage: "",
    city: "",
    zone: "",
    neighborhoods: [],
    bedrooms: "",
    budget: "",
    name: "",
    email: "",
    phone: ""
  });

  // Check if current step is completed
  useEffect(() => {
    const isCurrentStepCompleted = () => {
      switch (currentStep) {
        case 0:
          return !!formData.objective;
        case 1:
          return !!formData.stage;
        case 2:
          return !!formData.city && !!formData.zone && 
                 (formData.zone !== "zonasul" || formData.neighborhoods.length > 0);
        case 3:
          return !!formData.bedrooms && !!formData.budget;
        case 4:
          return !!formData.name && !!formData.email && !!formData.phone;
        default:
          return false;
      }
    };

    if (isCurrentStepCompleted() && !completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  }, [formData, currentStep, completedSteps]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Auto advance for radio buttons and selects
    if (field === "objective" || field === "stage") {
      // Wait a moment for visual feedback before advancing
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
    
    // For other selects, auto advance if all required fields are filled
    if (field === "city" || field === "zone") {
      if (field === "zone" && value !== "zonasul") {
        // If zone is selected and it's not "zonasul", auto advance
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 300);
      }
    }
    
    if (field === "neighborhoods") {
      // Auto advance if at least one neighborhood is selected
      if (value.length > 0) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 300);
      }
    }

    // For bedrooms and budget, auto advance if both are filled
    if ((field === "bedrooms" && formData.budget) || 
        (field === "budget" && formData.bedrooms)) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit the form
      console.log("Form submitted:", formData);
      // Redirect to results
      window.location.href = "/client/results";
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canNavigateToStep = (stepIndex: number) => {
    // Always allow navigating back
    if (stepIndex < currentStep) return true;
    
    // For forward navigation, ensure dependent steps are completed
    if (stepIndex === 5) {
      // Review step requires all previous steps to be completed
      return completedSteps.length >= 5;
    }
    
    // For other steps, check if previous steps are completed
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(i)) return false;
    }
    
    return true;
  };

  const navigateToStep = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AppLogo className="mx-auto mb-8" />
      
      <div className="bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-cyrela-blue">
            {steps[currentStep].title}
          </h2>
          <p className="text-cyrela-gray-dark mt-1">
            {steps[currentStep].description}
          </p>
        </div>
        
        {/* Progress indicator with clickable steps */}
        <div className="flex justify-between mb-8 items-center">
          {steps.map((_, index) => (
            <div 
              key={index}
              onClick={() => navigateToStep(index)}
              className={cn(
                "flex flex-col items-center cursor-pointer relative",
                {
                  "cursor-not-allowed opacity-60": !canNavigateToStep(index) && index !== currentStep,
                  "z-10": index === currentStep
                }
              )}
            >
              <div 
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 mb-1",
                  {
                    "bg-cyrela-blue text-white": index === currentStep,
                    "bg-cyrela-blue/20 text-cyrela-blue": completedSteps.includes(index) && index !== currentStep,
                    "bg-cyrela-gray-lighter text-cyrela-gray-dark": !completedSteps.includes(index) && index !== currentStep
                  }
                )}
              >
                {completedSteps.includes(index) ? 
                  <Check className="h-4 w-4" /> : 
                  (index + 1)}
              </div>
              
              {/* Line connecting steps */}
              {index < steps.length - 1 && (
                <div className="absolute h-1 w-full top-4 left-1/2 -z-10">
                  <div 
                    className={cn(
                      "h-1 bg-cyrela-gray-lighter absolute top-0 left-0 w-full",
                      {
                        "bg-cyrela-blue": completedSteps.includes(index) && completedSteps.includes(index + 1)
                      }
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Step content with animation */}
        <div className="animate-fade-in">
          {/* Step 1: Objetivo */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <RadioGroup
                value={formData.objective}
                onValueChange={(value) => handleInputChange("objective", value)}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="moradia" id="moradia" />
                  <Label htmlFor="moradia" className="cursor-pointer">Moradia</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="investimento" id="investimento" />
                  <Label htmlFor="investimento" className="cursor-pointer">Investimento</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {/* Step 2: Estágio da obra */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <RadioGroup
                value={formData.stage}
                onValueChange={(value) => handleInputChange("stage", value)}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="pronto" id="pronto" />
                  <Label htmlFor="pronto" className="cursor-pointer">Pronto para morar</Label>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <RadioGroupItem value="construcao" id="construcao" />
                  <Label htmlFor="construcao" className="cursor-pointer">Em construção</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planta" id="planta" />
                  <Label htmlFor="planta" className="cursor-pointer">Na planta</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {/* Step 3: Localização */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => handleInputChange("city", value)}
                >
                  <SelectTrigger id="city" className="cyrela-input">
                    <SelectValue placeholder="Selecione uma cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saopaulo">São Paulo</SelectItem>
                    <SelectItem value="santos">Santos</SelectItem>
                    <SelectItem value="cotia">Cotia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formData.city && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="zone">Zona</Label>
                  <Select
                    value={formData.zone}
                    onValueChange={(value) => handleInputChange("zone", value)}
                  >
                    <SelectTrigger id="zone" className="cyrela-input">
                      <SelectValue placeholder="Selecione uma zona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zonasul">Zona Sul</SelectItem>
                      <SelectItem value="zonanorte">Zona Norte</SelectItem>
                      <SelectItem value="zonaleste">Zona Leste</SelectItem>
                      <SelectItem value="zonaoeste">Zona Oeste</SelectItem>
                      <SelectItem value="abc">ABC Paulista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formData.zone === "zonasul" && (
                <div className="space-y-2 animate-fade-in">
                  <Label>Selecione até 3 bairros</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        formData.neighborhoods.includes("campobelo") && "bg-cyrela-blue text-white"
                      )}
                      onClick={() => {
                        const newNeighborhoods = [...formData.neighborhoods];
                        if (newNeighborhoods.includes("campobelo")) {
                          handleInputChange("neighborhoods", newNeighborhoods.filter(n => n !== "campobelo"));
                        } else if (newNeighborhoods.length < 3) {
                          handleInputChange("neighborhoods", [...newNeighborhoods, "campobelo"]);
                        }
                      }}
                      size="sm"
                    >
                      Campo Belo
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        formData.neighborhoods.includes("moema") && "bg-cyrela-blue text-white"
                      )}
                      onClick={() => {
                        const newNeighborhoods = [...formData.neighborhoods];
                        if (newNeighborhoods.includes("moema")) {
                          handleInputChange("neighborhoods", newNeighborhoods.filter(n => n !== "moema"));
                        } else if (newNeighborhoods.length < 3) {
                          handleInputChange("neighborhoods", [...newNeighborhoods, "moema"]);
                        }
                      }}
                      size="sm"
                    >
                      Moema
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        formData.neighborhoods.includes("ibirapuera") && "bg-cyrela-blue text-white"
                      )}
                      onClick={() => {
                        const newNeighborhoods = [...formData.neighborhoods];
                        if (newNeighborhoods.includes("ibirapuera")) {
                          handleInputChange("neighborhoods", newNeighborhoods.filter(n => n !== "ibirapuera"));
                        } else if (newNeighborhoods.length < 3) {
                          handleInputChange("neighborhoods", [...newNeighborhoods, "ibirapuera"]);
                        }
                      }}
                      size="sm"
                    >
                      Ibirapuera
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        formData.neighborhoods.includes("morumbi") && "bg-cyrela-blue text-white"
                      )}
                      onClick={() => {
                        const newNeighborhoods = [...formData.neighborhoods];
                        if (newNeighborhoods.includes("morumbi")) {
                          handleInputChange("neighborhoods", newNeighborhoods.filter(n => n !== "morumbi"));
                        } else if (newNeighborhoods.length < 3) {
                          handleInputChange("neighborhoods", [...newNeighborhoods, "morumbi"]);
                        }
                      }}
                      size="sm"
                    >
                      Morumbi
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Detalhes */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Número de dormitórios</Label>
                <Select
                  value={formData.bedrooms}
                  onValueChange={(value) => handleInputChange("bedrooms", value)}
                >
                  <SelectTrigger id="bedrooms" className="cyrela-input">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dormitório</SelectItem>
                    <SelectItem value="2">2 dormitórios</SelectItem>
                    <SelectItem value="3">3 dormitórios</SelectItem>
                    <SelectItem value="4+">4+ dormitórios</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Faixa de valor</Label>
                <Select
                  value={formData.budget}
                  onValueChange={(value) => handleInputChange("budget", value)}
                >
                  <SelectTrigger id="budget" className="cyrela-input">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500-800">R$ 500 mil - R$ 800 mil</SelectItem>
                    <SelectItem value="800-1200">R$ 800 mil - R$ 1.2 milhões</SelectItem>
                    <SelectItem value="1200-2000">R$ 1.2 milhões - R$ 2 milhões</SelectItem>
                    <SelectItem value="2000+">Acima de R$ 2 milhões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {/* Step 5: Contato */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Seu nome completo"
                  className="cyrela-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                  className="cyrela-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="cyrela-input"
                  required
                />
              </div>
            </div>
          )}
          
          {/* Step 6: Revisão */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-cyrela-blue">Resumo das Escolhas</h3>
                <p className="text-sm text-cyrela-gray-dark">Verifique suas informações antes de finalizar</p>
              </div>

              <div className="space-y-4 bg-cyrela-gray-lightest p-4 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">Objetivo:</span>
                  <span className="text-cyrela-blue">
                    {formData.objective === "moradia" ? "Moradia" : "Investimento"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Estágio:</span>
                  <span className="text-cyrela-blue">
                    {formData.stage === "pronto" ? "Pronto para morar" : 
                     formData.stage === "construcao" ? "Em construção" : "Na planta"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Cidade:</span>
                  <span className="text-cyrela-blue">
                    {formData.city === "saopaulo" ? "São Paulo" : 
                     formData.city === "santos" ? "Santos" : "Cotia"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Zona:</span>
                  <span className="text-cyrela-blue">
                    {formData.zone === "zonasul" ? "Zona Sul" : 
                     formData.zone === "zonanorte" ? "Zona Norte" : 
                     formData.zone === "zonaleste" ? "Zona Leste" : 
                     formData.zone === "zonaoeste" ? "Zona Oeste" : "ABC Paulista"}
                  </span>
                </div>
                
                {formData.zone === "zonasul" && formData.neighborhoods.length > 0 && (
                  <div className="flex justify-between">
                    <span className="font-medium">Bairros:</span>
                    <span className="text-cyrela-blue">
                      {formData.neighborhoods.map(n => 
                        n === "campobelo" ? "Campo Belo" : 
                        n === "moema" ? "Moema" : 
                        n === "ibirapuera" ? "Ibirapuera" : "Morumbi"
                      ).join(", ")}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="font-medium">Dormitórios:</span>
                  <span className="text-cyrela-blue">
                    {formData.bedrooms === "4+" ? "4+ dormitórios" : `${formData.bedrooms} dormitório${formData.bedrooms !== "1" ? "s" : ""}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Faixa de valor:</span>
                  <span className="text-cyrela-blue">
                    {formData.budget === "500-800" ? "R$ 500 mil - R$ 800 mil" : 
                     formData.budget === "800-1200" ? "R$ 800 mil - R$ 1.2 milhões" : 
                     formData.budget === "1200-2000" ? "R$ 1.2 milhões - R$ 2 milhões" : 
                     "Acima de R$ 2 milhões"}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Nome:</span>
                  <span className="text-cyrela-blue">{formData.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-cyrela-blue">{formData.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Telefone:</span>
                  <span className="text-cyrela-blue">{formData.phone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex justify-between">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          ) : (
            <div className="flex-1 mr-2"></div>
          )}
          
          <Button
            type="button"
            onClick={handleNext}
            className={cn(
              "flex-1 ml-2 bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white",
              {
                "pointer-events-none opacity-50": currentStep === 5 && completedSteps.length < 5
              }
            )}
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
            {currentStep !== steps.length - 1 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
