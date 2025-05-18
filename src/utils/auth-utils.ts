
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { UserSession } from '@/types/auth';
import { supabase } from '@/lib/supabase';

// Transform Supabase user to our UserSession format
export const transformUserData = async (user: User): Promise<UserSession> => {
  // Extract user metadata with proper defaults
  let role = user.user_metadata?.role as UserRole | undefined;
  
  // Se não tiver role no metadata, buscar do perfil
  if (!role) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (!error && data) {
        role = data.role as UserRole;
        console.log(`Retrieved role ${role} from profiles table for user ${user.id}`);
      }
    } catch (err) {
      console.error('Error fetching role from profile:', err);
    }
  }
  
  // Default to CLIENT role if still not found
  role = role || UserRole.CLIENT;
  
  return {
    id: user.id,
    email: user.email || '',
    user_metadata: {
      name: user.user_metadata?.name || '',
      role: role,
      brokerCode: user.user_metadata?.brokerCode,
      brokerage: user.user_metadata?.brokerage,
      creci: user.user_metadata?.creci,
      company: user.user_metadata?.company,
      city: user.user_metadata?.city,
      zone: user.user_metadata?.zone,
      profile_image: user.user_metadata?.profile_image
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
