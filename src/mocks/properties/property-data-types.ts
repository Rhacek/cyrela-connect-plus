
import { Property, PropertyStatus } from "@/types";

// Re-export the PropertyStatus enum
export { PropertyStatus } from "@/types";

// Define shared types for property data
export type PropertyCollection = {
  [key: string]: Property[];
};
