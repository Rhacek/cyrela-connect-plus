
import { UserRole } from "@/types";

export interface UserSession {
  id: string;
  email: string;
  expires_at?: number; // Add expires_at property to support session expiration checks
  user_metadata: {
    name: string;
    role: UserRole;
    brokerCode?: string;
    brokerage?: string;
    creci?: string;
    company?: string;
    city?: string;
    zone?: string;
    profile_image?: string; // Add profile_image property
  }
}
