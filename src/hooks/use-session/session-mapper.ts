
import { UserSession } from '@/types/auth';

// Define a conversion function to map Session to UserSession
export const mapToUserSession = (session: any): UserSession => {
  if (!session) return null;
  
  return {
    id: session.id,
    email: session.email || session.user?.email,
    expires_at: session.expires_at, // Include expires_at in the mapping
    user_metadata: session.user_metadata || session.user?.user_metadata || {}
  };
};
