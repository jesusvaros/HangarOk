import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseWrapper } from '../services/supabase/client';
import { useAuth } from '../store/auth/hooks';
import toast from 'react-hot-toast';
import { getSessionIdBack } from '../services/sessionManager';

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

      // Get session ID if it exists
      const sessionIdBack = await getSessionIdBack();

      const url = new URL(window.location.href);
      const sessionIdUrl = url.searchParams.get("sessionId") ?? undefined;

      const sessionId = sessionIdUrl || sessionIdBack;

      console.log('aqui llega? ', sessionIdUrl, sessionIdBack, sessionId)
      
      // If we have a user and a session ID, update the review_sessions table and check steps completion
      if (user && sessionId) {
        try {
          console.log('Updating review session with user ID:', user.id);
          await client
            .from('review_sessions')
            .update({ user_id: user.id })
            .eq('id', sessionId);
          
          // Get the current session status to check steps completion
          const { data: sessionData, error: sessionError } = await client.rpc('get_review_session', {
            p_session_id: sessionId,
          });
          
          if (sessionError) {
            throw sessionError;
          }
          
          if (sessionData && sessionData.length > 0) {
            const sessionStatus = sessionData[0];
            console.log('Session status:', sessionStatus);
            
            // Check which steps are completed
            const { step1_completed, step2_completed, step3_completed, step4_completed, step5_completed } = sessionStatus;
            
            // If all steps are completed, navigate to the review page
            if (step1_completed && step2_completed && step3_completed && step4_completed && step5_completed) {
              navigate(`/review/${sessionId}`);
              return;
            }
            
            // Otherwise, navigate to the last incomplete step
            if (!step1_completed) {
              navigate(`/add-review?step=1`);
            } else if (!step2_completed) {
              navigate(`/add-review?step=2`);
            } else if (!step3_completed) {
              navigate(`/add-review?step=3`);
            } else if (!step4_completed) {
              navigate(`/add-review?step=4`);
            } else if (!step5_completed) {
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
