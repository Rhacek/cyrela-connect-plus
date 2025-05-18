
import { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionInit } from '@/hooks/use-session-init';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { isAdmin, isBroker, isClient } from '@/utils/auth-utils';
import { signOutAndCleanup } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: UserSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, brokerCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAdmin: (email: string, password: string, name: string) => Promise<void>;
  isAdmin: () => boolean;
  isBroker: () => boolean;
  isClient: () => boolean;
  setSession: (session: UserSession | null) => void;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    session, 
    setSession, 
    loading, 
    setLoading, 
    initialized,
    setInitialized 
  } = useSessionInit();
  
  const { 
    signIn, 
    signUp, 
    createAdmin 
  } = useAuthActions(setSession, setLoading);

  // Improved signOut function that uses our enhanced cleanup
  const signOut = useCallback(async () => {
    try {
      console.log("Starting sign out process in AuthContext");
      setLoading(true);
      
      // First clear the local session to prevent redirection issues
      setSession(null);
      
      // Then use our enhanced signout function
      const { success, error } = await signOutAndCleanup();
      
      if (!success) {
        console.error("Error during sign out:", error);
        return;
      }
      
      console.log("Sign out completed successfully");
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSession]);

  // Role check methods using the utility functions
  const checkIsAdmin = useCallback(() => isAdmin(session), [session]);
  const checkIsBroker = useCallback(() => isBroker(session), [session]);
  const checkIsClient = useCallback(() => isClient(session), [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signUp,
        signOut,
        createAdmin,
        isAdmin: checkIsAdmin,
        isBroker: checkIsBroker,
        isClient: checkIsClient,
        setSession,
        initialized
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
