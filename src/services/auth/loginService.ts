import { getSessionId } from '../sessionManager';
import { supabaseWrapper } from '../supabase/client';

export type LoginStatus = 'idle' | 'loading' | 'link-sent' | 'error';

export const sendEmailOtp = async (email: string) => {
  const client = supabaseWrapper.getClient();
  const sessionId = await getSessionId(); // Use session_token for login link 

  if (!client || !email) {
    return { 
      success: false, 
      error: 'Introduce un correo electrónico válido.' 
    };
  }
  // Use environment variable for site URL, fallback to window.location.origin
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback?sessionId=${sessionId}`;
  
  console.log('Magic link redirect URL:', redirectUrl);
  
  try {
    const result = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl,
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
  const sessionId = await getSessionId(); // Use session_token for login link 
  if (!client) {
    return { 
      success: false, 
      error: 'Error de conexión con el servidor.' 
    };
  }

  // Use environment variable for site URL, fallback to window.location.origin
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const redirectUrl = `${siteUrl}/auth/callback?sessionId=${sessionId}`;
  
  console.log('Google OAuth redirect URL:', redirectUrl);

  try {
    const result = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
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
