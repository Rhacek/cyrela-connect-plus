
import { useState } from "react";
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
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";

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
  }
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        
        {/* Progress indicator */}
        <div className="flex justify-between mb-8">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={cn(
                "h-1 flex-1 rounded-full mx-0.5",
                index <= currentStep ? "bg-cyrela-blue" : "bg-cyrela-gray-lighter"
              )}
            />
          ))}
        </div>
        
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
            
            <div className="space-y-2">
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
            
            {formData.zone === "zonasul" && (
              <div className="space-y-2">
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
        
        <div className="mt-8 flex justify-between">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 mr-2"
            >
              Voltar
            </Button>
          ) : (
            <div className="flex-1 mr-2"></div>
          )}
          
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1 ml-2 bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
          >
            {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
          </Button>
        </div>
      </div>
    </div>
  );
}
