
import { UserRole } from "@/types";

export interface UserSession {
  id: string;
  email: string;
  access_token?: string;  // Add access_token property to track token validity
  refresh_token?: string; // Add refresh_token for session refreshing
  expires_at?: number;    
  user_metadata: {
    name: string;
    role: UserRole;
    brokerCode?: string;
    brokerage?: string;
    creci?: string;
    company?: string;
    city?: string;
    zone?: string;
    profile_image?: string;
  }
}
