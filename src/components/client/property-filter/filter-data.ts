
import { FilterOption } from "./filter-types";

export const constructionStages: FilterOption[] = [
  { id: "ready", label: "Pronto para morar" },
  { id: "construction", label: "Em construção" },
  { id: "planning", label: "Na planta" },
];

export const cities: FilterOption[] = [
  { id: "saopaulo", label: "São Paulo" },
  { id: "santos", label: "Santos" },
  { id: "cotia", label: "Cotia" },
];

export const zones: FilterOption[] = [
  { id: "zonasul", label: "Zona Sul" },
  { id: "zonanorte", label: "Zona Norte" },
  { id: "zonaleste", label: "Zona Leste" },
  { id: "zonaoeste", label: "Zona Oeste" },
  { id: "abcpaulista", label: "ABC Paulista" },
];

// Sample neighborhoods for Zone Sul
export const zoneNeighborhoods: Record<string, FilterOption[]> = {
  zonasul: [
    { id: "campobelo", label: "Campo Belo" },
    { id: "ibirapuera", label: "Ibirapuera" },
    { id: "klabin", label: "Klabin" },
    { id: "moema", label: "Moema" },
    { id: "morumbi", label: "Morumbi" },
    // We'd add more neighborhoods as needed
  ],
  zonanorte: [
    { id: "tucuruvi", label: "Tucuruvi" },
    { id: "freguesia", label: "Freguesia do Ó" },
  ],
  // We'd add more zones with their neighborhoods as needed
};

export const bedrooms: FilterOption[] = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4+" },
];
