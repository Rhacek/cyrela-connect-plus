import { useState } from 'react';
import { UserSession } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { transformUserData } from '@/utils/auth-utils';
import { toast } from './use-toast';

export const useAuthActions = (
  setSession: (session: UserSession | null) => void,
  setLoading: (loading: boolean) => void
) => {
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error signing in:', error);
        setError(error.message);
        toast.error('Erro ao fazer login', {
          description: error.message,
        });
        return;
      }

      if (data.session) {
        console.log("User signed in successfully");
        
        // Get user role from profiles table if not in metadata
        const userSession = await transformUserData(data.session.user);
        
        // Adicionar informações de tokens
        userSession.access_token = data.session.access_token;
        userSession.refresh_token = data.session.refresh_token;
        userSession.expires_at = data.session.expires_at;
        
        setSession(userSession);
        
        toast.success('Login realizado com sucesso');
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Erro inesperado', { description: 'Tente novamente mais tarde' });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, brokerCode?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Role é BROKER se tiver brokerCode, senão é CLIENT
      const role = brokerCode ? UserRole.BROKER : UserRole.CLIENT;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            brokerCode,
          },
        },
      });

      if (error) {
        console.error('Error signing up:', error);
        setError(error.message);
        toast.error('Erro ao criar conta', {
          description: error.message,
        });
        return;
      }

      console.log('User signed up successfully', data);
      toast.success('Conta criada com sucesso', {
        description: 'Verifique seu email para confirmar sua conta.',
      });
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Erro inesperado', { description: 'Tente novamente mais tarde' });
    } finally {
      setLoading(false);
    }
  };

  // Specific function for creating admin accounts
  const createAdmin = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: UserRole.ADMIN,
          },
        },
      });

      if (error) {
        console.error('Error creating admin:', error);
        setError(error.message);
        toast.error('Erro ao criar administrador', {
          description: error.message,
        });
        return;
      }

      console.log('Admin created successfully', data);
      toast.success('Administrador criado com sucesso', {
        description: 'Verifique seu email para confirmar sua conta.',
      });
    } catch (error) {
      console.error('Unexpected error during admin creation:', error);
      setError('An unexpected error occurred. Please try again.');
      toast.error('Erro inesperado', { description: 'Tente novamente mais tarde' });
    } finally {
      setLoading(false);
    }
  };

  return { signIn, signUp, createAdmin, error };
};
