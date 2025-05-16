
import { createContext, useContext, ReactNode } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionInit } from '@/hooks/use-session-init';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { isAdmin, isBroker, isClient } from '@/utils/auth-utils';

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
  setSession: (session: UserSession | null) => void; // Add this line to expose setSession
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { 
    session, 
    setSession, 
    loading, 
    setLoading 
  } = useSessionInit();
  
  const { 
    signIn, 
    signUp, 
    signOut, 
    createAdmin 
  } = useAuthActions(setSession, setLoading);

  // Role check methods using the utility functions
  const checkIsAdmin = () => isAdmin(session);
  const checkIsBroker = () => isBroker(session);
  const checkIsClient = () => isClient(session);

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
        setSession, // Add this line to expose setSession in the context
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
