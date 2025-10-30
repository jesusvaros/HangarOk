import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseWrapper } from '../services/supabase/client';
import { useAuth } from '../store/auth/hooks';
import toast from 'react-hot-toast';
import { getSessionIdBack, getSessionId } from '../services/sessionManager';

/**
 * AuthCallback handles the redirection coming from Supabase OAuth / Magic-Link.
 * Handles two scenarios:
 * 1. Regular login (no session ID) - just redirects to home
 * 2. Review submission login (with session ID):
 *    - Updates the review_sessions table with the user_id
 *    - Redirects to the review page
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  // We don't need searchParams anymore
  const { user, isLoading } = useAuth();
  const [processingComplete, setProcessingComplete] = useState(false);

  useEffect(() => {
    // Only proceed when auth state is determined (either user is loaded or definitely null)
    if (isLoading || processingComplete) {
      return;
    }

    // Set processing flag immediately to prevent multiple executions
    setProcessingComplete(true);
    
    const completeLogin = async () => {
      console.log('Auth state determined, user:', user);
      
      const client = supabaseWrapper.getClient();
      if (!client) {
        toast.error('Error de configuración de Supabase');
        navigate('/');
        return;
      }

      // Get the current session from Supabase
      const { data: { session }, error: sessionError } = await client.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        toast.error('Error al obtener la sesión');
        navigate('/');
        return;
      }
      
      // Store the session in localStorage for persistence
      if (session) {
        localStorage.setItem('cv_session', JSON.stringify(session));
      }

      // Get session token (frontend) and session ID (backend)
      const sessionIdBack = await getSessionIdBack(); // This is the database row ID
      const sessionToken = await getSessionId(); // This is the session_token

      const url = new URL(window.location.href);
      const sessionIdUrl = url.searchParams.get("sessionId") ?? undefined;

      // Use session_token for linking user (not the database row ID)
      const tokenToUse = sessionIdUrl || sessionToken;

      console.log('Session info:', { 
        sessionIdUrl, 
        sessionIdBack, 
        sessionToken: tokenToUse, 
        user 
      });
      
      // If we have a user and a session token, update the review_sessions table and check steps completion
      if (user && tokenToUse) {
        try {
          console.log('Updating review session with user ID:', user.id);
          console.log('Session token:', tokenToUse);
          
          // Use the RPC function that searches by session_token
          const { data: sessionData, error: sessionError } = await client.rpc('update_review_session_user_by_token', {
            p_session_token: tokenToUse,
            p_user_id: user.id
          });
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (sessionData && sessionData.length > 0) {
            const sessionStatus = sessionData[0];
            console.log('Session status:', sessionStatus);
            
            // Update localStorage with the correct session info after linking user
            localStorage.setItem('reviewSessionId', sessionStatus.session_token);
            localStorage.setItem('reviewSessionIdBack', sessionStatus.id);
            
            // Check which steps are completed (note: fields use underscores from SQL)
            const { 
              step_1_completed, 
              step_2_completed, 
              step_3_completed, 
              step_4_completed, 
              step_5_completed 
            } = sessionStatus;
            
            // If all steps are completed, navigate to the review page
            if (step_1_completed && step_2_completed && step_3_completed && step_4_completed && step_5_completed) {
              // Use the database row ID for the review page URL
              navigate(`/review/${sessionStatus.id}`);
              return;
            }
            
            // Otherwise, navigate to the last incomplete step
            if (!step_1_completed) {
              navigate(`/add-review?step=1`);
            } else if (!step_2_completed) {
              navigate(`/add-review?step=2`);
            } else if (!step_3_completed) {
              navigate(`/add-review?step=3`);
            } else if (!step_4_completed) {
              navigate(`/add-review?step=4`);
            } else if (!step_5_completed) {
              navigate(`/add-review?step=5`);
            } 
          } else {
            // No session data found
            navigate('/');
          }
        } catch (error) {
          console.error('Error updating review session:', error);
          toast.error('Error al actualizar la sesión');
          navigate('/');
        }
      } else {
        // Regular login (no session ID) or no user
        console.log('Regular login (no session ID) or no user');
        if (!user) {
          toast.error('No se pudo validar la sesión.');
        } else {
          toast.success('Sesión iniciada correctamente');
        }
        navigate('/');
      }
    };

    completeLogin();
  }, [navigate, user, isLoading, processingComplete]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-center text-sm text-gray-600">Confirmando sesión…</p>
    </div>
  );
};

export default AuthCallback;
