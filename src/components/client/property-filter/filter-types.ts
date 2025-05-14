
export type FilterCategory = "constructionStage" | "city" | "zone" | "neighborhood" | "bedrooms";

export interface FilterOption {
  id: string;
  label: string;
}

export const defaultFilterState: Record<FilterCategory, string[]> = {
  constructionStage: [],
  city: [],
  zone: [],
  neighborhood: [],
  bedrooms: []
};
