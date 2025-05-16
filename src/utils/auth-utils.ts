
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { UserSession } from '@/types/auth';

// Transform Supabase user to our UserSession format
export const transformUserData = (user: User): UserSession => {
  return {
    id: user.id,
    email: user.email || '',
    user_metadata: {
      name: user.user_metadata?.name || '',
      role: (user.user_metadata?.role as UserRole) || UserRole.CLIENT,
      brokerCode: user.user_metadata?.brokerCode,
      brokerage: user.user_metadata?.brokerage,
      creci: user.user_metadata?.creci,
      company: user.user_metadata?.company,
      city: user.user_metadata?.city,
      zone: user.user_metadata?.zone,
    }
  };
};

// Role checking utility functions
export const isAdmin = (session: UserSession | null): boolean => {
  return session?.user_metadata.role === UserRole.ADMIN;
};

export const isBroker = (session: UserSession | null): boolean => {
  return session?.user_metadata.role === UserRole.BROKER;
};

export const isClient = (session: UserSession | null): boolean => {
  return session?.user_metadata.role === UserRole.CLIENT;
};
