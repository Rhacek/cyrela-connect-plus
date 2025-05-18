
export interface PropertyFilter {
  search?: string;
  priceMin?: number;
  priceMax?: number;
  locations?: string[];
  bedrooms?: number[];
  constructionStages?: string[];
  isActive?: boolean;
}
