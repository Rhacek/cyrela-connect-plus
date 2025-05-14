
export type FilterCategory = "constructionStage" | "city" | "zone" | "neighborhood" | "bedrooms";

export const defaultFilterState: Record<FilterCategory, string[]> = {
  constructionStage: [],
  city: [],
  zone: [],
  neighborhood: [],
  bedrooms: []
};
