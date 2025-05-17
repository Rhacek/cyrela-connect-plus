
import { UserSession } from '@/types/auth';
import { UserRole } from '@/types';

/**
 * Checks if a user has permission to access based on their role
 */
export const hasRolePermission = (
  session: UserSession | null, 
  allowedRoles?: UserRole[]
): boolean => {
  // If no session, definitely no permission
  if (!session) return false;
  
  // If no roles specified, any authenticated user is allowed
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  // Check if user's role is in allowed roles
  const userRole = session.user_metadata.role;
  return allowedRoles.includes(userRole);
};
