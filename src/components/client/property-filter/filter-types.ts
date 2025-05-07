
export interface FilterOption {
  id: string;
  label: string;
}

export interface PropertyFilterProps {
  className?: string;
  onApplyFilters?: (filters: any) => void;
  onReset?: () => void;
  selectedFilters: Record<FilterCategory, string[]>;
  onFilterChange: (category: FilterCategory, id: string) => void;
}

export type FilterCategory = 
  | "constructionStage" 
  | "city" 
  | "zone" 
  | "neighborhood" 
  | "bedrooms";

export interface FilterState {
  priceRange: number[];
  selectedZone: string | null;
  selectedFilters: Record<FilterCategory, string[]>;
}
