
export interface PropertyFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  city?: string;
  neighborhood?: string | string[];
  propertyType?: string | string[];
  isActive?: boolean;
  highlighted?: boolean;
}
