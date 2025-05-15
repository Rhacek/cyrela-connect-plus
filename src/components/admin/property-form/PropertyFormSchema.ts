
import { z } from "zod";
import { PropertyStatus } from "@/mocks/property-data";

export const propertyFormSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  developmentName: z.string().min(1, "O nome do empreendimento é obrigatório"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.string().min(1, "Selecione um tipo de imóvel"),
  price: z.coerce.number().positive("O preço deve ser um valor positivo"),
  promotionalPrice: z.coerce.number().nonnegative("O preço promocional deve ser um valor não negativo").optional(),
  area: z.coerce.number().positive("A área deve ser um valor positivo"),
  bedrooms: z.coerce.number().int().nonnegative("O número de quartos não pode ser negativo"),
  bathrooms: z.coerce.number().int().nonnegative("O número de banheiros não pode ser negativo"),
  suites: z.coerce.number().int().nonnegative("O número de suítes não pode ser negativo"),
  parkingSpaces: z.coerce.number().int().nonnegative("O número de vagas não pode ser negativo"),
  address: z.string().min(1, "O endereço é obrigatório"),
  neighborhood: z.string().min(1, "O bairro é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  zipCode: z.string().min(1, "O CEP é obrigatório"),
  constructionStage: z.string().optional(),
  youtubeUrl: z.string().url("Insira uma URL válida").or(z.string().length(0)).optional(),
  isHighlighted: z.boolean().default(false),
  
  // Campos específicos para corretores
  brokerNotes: z.string().optional(),
  commission: z.coerce.number().nonnegative("A comissão não pode ser negativa").optional(),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export const defaultPropertyValues: PropertyFormValues = {
  title: "",
  developmentName: "",
  description: "",
  type: "Apartamento",
  price: 0,
  promotionalPrice: undefined,
  area: 0,
  bedrooms: 0,
  bathrooms: 0,
  suites: 0,
  parkingSpaces: 0,
  address: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  constructionStage: "",
  youtubeUrl: "",
  isHighlighted: false,
  
  // Valores padrão para campos de corretor
  brokerNotes: "",
  commission: 0,
};
