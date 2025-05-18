
import { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { UserSession } from '@/types/auth';
import { useSessionInit } from '@/hooks/use-session-init';
import { useAuthActions } from '@/hooks/use-auth-actions';
import { isAdmin, isBroker, isClient, transformUserData } from '@/utils/auth-utils';
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
  
  // Set up auth state change listener and proactively get session
  useEffect(() => {
    let isMounted = true;
    console.log("Setting up AuthProvider with auth state listener and session fetch");
    
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      console.log(`Auth state changed: ${event}`);
      
      if (!isMounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (supabaseSession) {
          try {
            // Transform Supabase session to our format (agora assíncrono)
            const userSession = await transformUserData(supabaseSession.user);
            
            // Adicionar informações de tokens
            userSession.access_token = supabaseSession.access_token;
            userSession.refresh_token = supabaseSession.refresh_token;
            userSession.expires_at = supabaseSession.expires_at;
            
            setSession(userSession);
          } catch (err) {
            console.error("Error transforming user data:", err);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      }
    });
    
    // Proactively fetch the current session
    const fetchCurrentSession = async () => {
      try {
        console.log("Proactively fetching current session in AuthProvider");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
        
        if (data.session) {
          console.log("Session found in AuthProvider:", data.session.user.id);
          try {
            // Transform Supabase session to our format (agora assíncrono)
            const userSession = await transformUserData(data.session.user);
            
            // Adicionar informações de tokens
            userSession.access_token = data.session.access_token;
            userSession.refresh_token = data.session.refresh_token;
            userSession.expires_at = data.session.expires_at;
            
            if (isMounted) {
              setSession(userSession);
            }
          } catch (err) {
            console.error("Error transforming user data:", err);
          }
        } else {
          console.log("No session found in AuthProvider");
        }
        
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error in fetchCurrentSession:", error);
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };
    
    fetchCurrentSession();
    
    // Cleanup subscription and set mounted flag
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, setLoading, setInitialized]);
  
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
