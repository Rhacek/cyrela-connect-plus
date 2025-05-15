
// This file is maintained for backward compatibility
// It re-exports everything from the new modular structure

import { mockProperties, PropertyStatus } from "./properties";

export { PropertyStatus } from "@/types";
export { mockProperties };

// Also export the individual collections for more granular access
export {
  cyrelaProperties,
  livingProperties,
  otherProperties
} from "./properties";
