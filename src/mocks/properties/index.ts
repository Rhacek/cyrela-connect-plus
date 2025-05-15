
import { PropertyStatus } from "@/types";
import { cyrelaProperties } from "./cyrela-properties";
import { livingProperties } from "./living-properties";
import { otherProperties } from "./other-properties";

// Re-export the PropertyStatus enum
export { PropertyStatus } from "@/types";

// Combine all property collections
export const mockProperties = [
  ...cyrelaProperties,
  ...livingProperties,
  ...otherProperties
];

// Export individual collections for more granular access
export {
  cyrelaProperties,
  livingProperties,
  otherProperties
};
