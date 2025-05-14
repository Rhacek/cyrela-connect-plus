
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

// Add missing PropertyFilterState interface
export interface PropertyFilterState {
  search: string;
  locations: string[];
  priceRange: number[];
  features: string[];
  constructionStage: string;
  [key: string]: any;
}

// Default filter state
export const defaultFilterState: PropertyFilterState = {
  search: '',
  locations: [],
  priceRange: [300000, 2000000],
  features: [],
  constructionStage: ''
};

// Type for filter change handler
export type FilterChangeHandler = (filterKey: keyof PropertyFilterState, value: any) => void;
