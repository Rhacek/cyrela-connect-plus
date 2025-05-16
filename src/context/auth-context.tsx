
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/types';
import { UserSession } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log("AuthProvider initializing");
    
    let isMounted = true;
    
    const initialize = async () => {
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            if (currentSession?.user) {
              console.log("Setting session from auth state change:", currentSession.user.id);
              if (isMounted) {
                setSession(transformUserData(currentSession.user));
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing session");
              if (isMounted) {
                setSession(null);
              }
            }
            
            if (isMounted) {
              setLoading(false);
            }
          }
        );

        // Then check for existing session
        const { data: { session: supabaseSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (supabaseSession?.user) {
          console.log("Found existing session:", supabaseSession.user.id);
          if (isMounted) {
            setSession(transformUserData(supabaseSession.user));
          }
        } else {
          console.log("No existing session found");
        }
        
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Error during auth initialization:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    initialize();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Transform Supabase user to our UserSession format
  const transformUserData = (user: User): UserSession => {
    return {
      id: user.id,
      email: user.email || '',
      user_metadata: {
        name: user.user_metadata.name || '',
        role: (user.user_metadata.role as UserRole) || UserRole.CLIENT,
        brokerCode: user.user_metadata.brokerCode,
        brokerage: user.user_metadata.brokerage,
        creci: user.user_metadata.creci,
        company: user.user_metadata.company,
        city: user.user_metadata.city,
        zone: user.user_metadata.zone,
      }
    };
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("Signing in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        toast.error('Erro ao fazer login', {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Sign in successful:", data.user.id);
        const transformedUser = transformUserData(data.user);
        console.log("Transformed user:", transformedUser);
        setSession(transformedUser);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, brokerCode?: string) => {
    try {
      setLoading(true);
      
      // Determine the role based on whether a broker code was provided
      const role = brokerCode ? UserRole.BROKER : UserRole.CLIENT;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...(brokerCode && { brokerCode }),
          },
        },
      });

      if (error) {
        toast.error('Erro ao criar conta', {
          description: error.message,
        });
        return;
      }

      toast.success('Conta criada com sucesso!', {
        description: 'Verifique seu e-mail para confirmar sua conta.',
      });
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Para o administrador, enviamos a role como string para evitar problemas com o tipo enum
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "ADMIN", // Enviamos como string em vez de UserRole.ADMIN
          },
        },
      });

      if (error) {
        toast.error('Erro ao criar administrador', {
          description: error.message,
        });
        return;
      }

      toast.success('Administrador criado com sucesso!', {
        description: 'Verifique o e-mail do administrador para confirmar a conta.',
      });
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Erro ao criar administrador');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error('Erro ao sair', {
          description: error.message,
        });
        return;
      }
      
      toast.success('Você saiu com sucesso');
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao sair');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return session?.user_metadata.role === UserRole.ADMIN;
  };

  const isBroker = () => {
    return session?.user_metadata.role === UserRole.BROKER;
  };

  const isClient = () => {
    return session?.user_metadata.role === UserRole.CLIENT;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signUp,
        signOut,
        createAdmin,
        isAdmin,
        isBroker,
        isClient,
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
