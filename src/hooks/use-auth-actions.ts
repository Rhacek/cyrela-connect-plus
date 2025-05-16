
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
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
      const role = brokerCode ? "BROKER" : "CLIENT";
      
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

  return {
    signIn,
    signUp,
    signOut,
    createAdmin,
  };
};
