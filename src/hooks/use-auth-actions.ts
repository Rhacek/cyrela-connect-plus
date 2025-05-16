
import { supabase, getCurrentSession } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { transformUserData } from '@/utils/auth-utils';
import { UserSession } from '@/types/auth';

export const useAuthActions = (
  setSession: (session: UserSession | null) => void,
  setLoading: (loading: boolean) => void
) => {
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

      if (data.session) {
        console.log("Sign in successful:", data.session.user.id);
        const transformedUser = transformUserData(data.session.user);
        
        // Validate the session immediately after login
        const validationSession = await getCurrentSession();
        
        if (!validationSession) {
          console.error("Session validation failed immediately after login");
          toast.error('Falha na autenticação', {
            description: 'Não foi possível estabelecer a sessão.'
          });
          return;
        }
        
        console.log("Session validated after login");
        setSession(transformedUser);
        toast.success('Login realizado com sucesso!');

        // Verify session persistence
        setTimeout(async () => {
          const sessionCheck = await getCurrentSession();
          console.log("Session check after login:", !!sessionCheck?.user?.id);
        }, 500);
      } else {
        console.error("No session returned after successful login");
        toast.error('Falha na autenticação', {
          description: 'Login bem-sucedido, mas nenhuma sessão foi criada.'
        });
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Erro ao fazer login', {
        description: error?.message || 'Ocorreu um erro inesperado.'
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, brokerCode?: string) => {
    try {
      setLoading(true);
      
      // Determine the role based on whether a broker code was provided
      const role = brokerCode ? "BROKER" : "CLIENT";
      
      console.log(`Signing up new user with email ${email} and role ${role}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            ...(brokerCode && { brokerCode }),
          },
          emailRedirectTo: window.location.origin + '/auth',
        },
      });

      if (error) {
        console.error('Error signing up:', error);
        toast.error('Erro ao criar conta', {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Sign up successful for:", data.user.id);
      }

      toast.success('Conta criada com sucesso!', {
        description: 'Verifique seu e-mail para confirmar sua conta.',
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('Erro ao criar conta', {
        description: error?.message || 'Ocorreu um erro inesperado.'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      console.log(`Creating admin user with email ${email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "ADMIN",
          },
          emailRedirectTo: window.location.origin + '/auth',
        },
      });

      if (error) {
        console.error('Error creating admin:', error);
        toast.error('Erro ao criar administrador', {
          description: error.message,
        });
        return;
      }

      if (data.user) {
        console.log("Admin creation successful for:", data.user.id);
      }

      toast.success('Administrador criado com sucesso!', {
        description: 'Verifique o e-mail do administrador para confirmar a conta.',
      });
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error('Erro ao criar administrador', {
        description: error?.message || 'Ocorreu um erro inesperado.'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    createAdmin,
  };
};
