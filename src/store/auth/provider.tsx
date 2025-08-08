import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabaseWrapper } from '../../services/supabase/client';
import { AuthContext } from './context';

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const client = supabaseWrapper.getClient();
        if (!client) {
          setError('Error de configuración de Supabase');
          setIsLoading(false);
          return;
        }

        // Get current user
        const { data, error: userError } = await client.auth.getUser();
        
        if (userError) {
          setError(userError.message);
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          setUser(data.user);
          
          // Check if user is admin (using the same logic as in ModerationPage)
          const userEmail = data.user.email;
          // This should match the admin email in the Edge Function
          setIsAdmin(userEmail === 'xjesusvr@gmail.com');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchUser();

    // Set up auth state change listener
    const client = supabaseWrapper.getClient();
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            setUser(session.user);
            // Check if user is admin
            setIsAdmin(session.user.email === 'xjesusvr@gmail.com');
          } else {
            setUser(null);
            setIsAdmin(false);
          }
          setIsLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Implement logout functionality
  const logout = async () => {
    const client = supabaseWrapper.getClient();
    if (client) {
      await client.auth.signOut();
      // Clear any local storage items related to auth and review sessions
      localStorage.removeItem('cv_session');
      localStorage.removeItem('reviewSessionId');
      localStorage.removeItem('reviewSessionIdBack');
      setUser(null);
      setIsAdmin(false);
    }
  };

  // The value that will be given to consumers of this context
  const value = {
    user,
    isLoading,
    error,
    isAdmin,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
