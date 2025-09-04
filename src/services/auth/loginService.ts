import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from '../supabase/client';

export type LoginStatus = 'idle' | 'loading' | 'link-sent' | 'error';

export const sendEmailOtp = async (email: string) => {
  const client = supabaseWrapper.getClient();
  const sessionId = await getSessionIdBack(); 

  if (!client || !email) {
    return { 
      success: false, 
      error: 'Introduce un correo electrónico válido.' 
    };
  }
console.log('Session ID:', sessionId,window.location.origin);
  try {
    const result = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?sessionId=${sessionId}`,
      },
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Error al conectar con el servidor de autenticación. ${message}`
    };
  }
};

/**
 * Initiates Google OAuth login flow
 * @returns Object containing success status and error message if any
 */
export const signInWithGoogle = async () => {
  const client = supabaseWrapper.getClient();
  const sessionId = await getSessionIdBack(); 
  if (!client) {
    return { 
      success: false, 
      error: 'Error de conexión con el servidor.' 
    };
  }

  try {
    const result = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?sessionId=${sessionId}`,
      },
    });
    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Error al iniciar sesión con Google. ${message}`
    };
  }
};
