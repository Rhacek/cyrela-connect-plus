
import { OnboardingFormData } from "../types";

interface ReviewStepProps {
  formData: OnboardingFormData;
}

export function ReviewStep({ formData }: ReviewStepProps) {
  return (
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
  );
}
