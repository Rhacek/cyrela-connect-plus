
import { UserRole } from "@/types";

export interface UserSession {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    role: UserRole;
    brokerCode?: string;
    brokerage?: string;
    creci?: string;
    company?: string;
    city?: string;
    zone?: string;
  }
}
