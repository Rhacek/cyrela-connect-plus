
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

// Neighborhoods for all zones
export const zoneNeighborhoods: Record<string, FilterOption[]> = {
  zonasul: [
    { id: "campobelo", label: "Campo Belo" },
    { id: "ibirapuera", label: "Ibirapuera" },
    { id: "klabin", label: "Klabin" },
    { id: "moema", label: "Moema" },
    { id: "morumbi", label: "Morumbi" },
    { id: "vilamadalena", label: "Vila Madalena" },
    { id: "jardimpaulista", label: "Jardim Paulista" },
    { id: "itaimbibi", label: "Itaim Bibi" },
  ],
  zonanorte: [
    { id: "tucuruvi", label: "Tucuruvi" },
    { id: "freguesia", label: "Freguesia do Ó" },
    { id: "santana", label: "Santana" },
    { id: "tremembé", label: "Tremembé" },
    { id: "jardimfranca", label: "Jardim França" },
    { id: "vilamedeiros", label: "Vila Medeiros" },
  ],
  zonaleste: [
    { id: "tatuape", label: "Tatuapé" },
    { id: "mooca", label: "Mooca" },
    { id: "analia", label: "Anália Franco" },
    { id: "penha", label: "Penha" },
    { id: "vilamatilde", label: "Vila Matilde" },
    { id: "belenzinho", label: "Belenzinho" },
  ],
  zonaoeste: [
    { id: "perdizes", label: "Perdizes" },
    { id: "pinheiros", label: "Pinheiros" },
    { id: "altodelapa", label: "Alto de Pinheiros" },
    { id: "butanta", label: "Butantã" },
    { id: "lapa", label: "Lapa" },
    { id: "vilaromana", label: "Vila Romana" },
  ],
  abcpaulista: [
    { id: "santoandre", label: "Santo André" },
    { id: "saobernardo", label: "São Bernardo do Campo" },
    { id: "saocaetano", label: "São Caetano do Sul" },
    { id: "diadema", label: "Diadema" },
    { id: "maua", label: "Mauá" },
    { id: "riograndeserra", label: "Rio Grande da Serra" },
  ],
};

export const bedrooms: FilterOption[] = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4+" },
];
