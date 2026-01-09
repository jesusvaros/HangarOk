import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../store/useFormContext';
import { useAuth } from '../../store/auth/hooks';
import { getSessionIdBack } from '../../services/sessionManager';
import { sendEmailOtp, signInWithGoogle } from '../../services/auth/loginService';
import type { LoginStatus } from '../../services/auth/loginService';
import { trackUmamiEvent } from '../../utils/analytics';

interface LoginContentProps {
  onClose?: () => void;
  showTitle?: boolean;
  onLoginComplete?: (sessionId: string, userId: string) => void;
  showInfo?: boolean;
  mode?: 'default' | 'subscription';
}

const LoginContent: React.FC<LoginContentProps> = ({ 
  onClose, 
  showTitle = true,
  onLoginComplete,
  showInfo = true,
  mode = 'default',
}) => {
  const { formData, updateFormData } = useFormContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    if (status === 'link-sent' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [status, resendTimer]);

  // Check user from auth context and redirect to review page if user is already validated
  useEffect(() => {
    const checkUserSession = async () => {
      if (!user) return;
      
      // If we have a user from auth context, get the session ID and navigate
      const sessionId = await getSessionIdBack();
      if (sessionId) {
        if (onLoginComplete && user?.id) {
          // Delegate post-login flow to parent if provided
          onLoginComplete(sessionId, user.id);
        } else {
          navigate(`/`);
          if (onClose) onClose();
        }
      } else {
        navigate('/');
        if (onClose) onClose();
      }
    };

    // Initial session check on mount
    checkUserSession();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'supabase.auth.token') {
        checkUserSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Periodically poll session in case storage event is missed
    const interval = setInterval(checkUserSession, 15000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [navigate, user, onClose, onLoginComplete]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactEmail) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    trackUmamiEvent('login:email-submit');
    const result = await sendEmailOtp(formData.contactEmail);
    
    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.error || 'We couldn’t send the link');
    } else {
      setStatus('link-sent');
      setResendTimer(30);
      setCanResend(false);
    }
  };

  const handleGoogleLogin = async () => {
    trackUmamiEvent('login:google');
    await signInWithGoogle();
  };

  return (
    <>
      {showTitle && (
        <h2 className="mb-6 text-3xl font-black tracking-tight text-gray-900 leading-tight">
          {mode === 'subscription' ? 'Subscribe to Review Night' : 'Save and verify your review'}
        </h2>
      )}

      {showInfo && (
        <div className="mb-8 space-y-4">
          {(mode === 'subscription' ? [
            { text: "Early access to live review events", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
            { text: "Riding experiences and community updates", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
          ] : [
            { text: "Validated, trustworthy review", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { text: "Always 100% anonymous", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { text: "Edit or delete later", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" }
          ]).map((item, i) => (
            <div key={i} className="flex items-start gap-4 text-gray-600 leading-tight">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[rgb(74,94,50)]/10 flex items-center justify-center text-[rgb(74,94,50)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
                </svg>
              </div>
              <span className="text-sm font-semibold pt-0.5">{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {status === 'idle' || status === 'error' ? (
        <>
          <form onSubmit={handleEmailLogin} className="mb-3">
            <div className="mb-4">
              <label 
                htmlFor="contactEmail" 
                className="mb-1 block text-base font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="contactEmail"
                value={formData.contactEmail || ''}
                onChange={e => updateFormData({ contactEmail: e.target.value })}
                required
                className="w-full rounded-lg border p-3 text-base focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)]"
                placeholder="you@example.com"
              />
            </div>

            {status === 'error' && (
              <p className="mb-2 text-base text-red-600">
                {errorMessage || 'There was a problem sending the link'}
              </p>
            )}

            <button
              type="submit"
              className="mb-2 w-full rounded-lg bg-[rgb(74,94,50)] py-2.5 text-base text-white hover:bg-[rgb(60,76,40)]"
            >
              {mode === 'subscription' ? 'Subscribe via email' : 'Verify via email'}
            </button>
          </form>
        </>
      ) : status === 'loading' ? (
        <p className="text-center text-base text-gray-600">Sending login link...</p>
      ) : (
        <div className="mb-3 rounded-md bg-gray-50 p-4 text-base text-gray-700">
          {isEditingEmail ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                setIsEditingEmail(false);
                handleEmailLogin(e);
              }}
              className="space-y-2"
            >
              <input
                type="email"
                className="w-full rounded-lg border p-2.5 text-base"
                value={formData.contactEmail}
                onChange={e => updateFormData({ contactEmail: e.target.value })}
              />
              <button
                type="submit"
                className="w-full rounded bg-[rgb(74,94,50)] py-2.5 text-base text-white hover:bg-[rgb(60,76,40)]"
              >
                Send a new link
              </button>
            </form>
          ) : (
            <>
              <p className="mb-2 text-base">
                📩 We’ve sent a sign-in link to{' '}
                <span className="font-semibold">{formData.contactEmail}</span>.
              </p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    trackUmamiEvent('login:change-email');
                    setIsEditingEmail(true);
                  }}
                  className="text-base text-blue-600 underline hover:text-blue-800"
                >
                  Change email
                </button>
                <button
                  onClick={() => {
                    trackUmamiEvent('login:resend-link');
                    handleEmailLogin({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  disabled={!canResend}
                  className={`text-base ${canResend ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                >
                  {canResend ? 'Resend link' : `Resend in ${resendTimer}s`}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="my-2 mb-4 flex items-center justify-center">
        <span className="mx-2 text-sm text-gray-500">or</span>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
      >
        <svg
          className="mr-2 h-5 w-5"
          viewBox="0 0 533.5 544.3"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#4285F4"
            d="M533.5 278.4c0-17.4-1.4-34.2-4-50.4H272v95.4h146.9c-6.3 34-25.2 62.8-53.7 82v68h86.8c50.8-46.8 80.5-115.7 80.5-195z"
          />
          <path
            fill="#34A853"
            d="M272 544.3c72.6 0 133.6-24 178.1-65.6l-86.8-68c-24.1 16.2-55 25.8-91.3 25.8-70 0-129.4-47.2-150.7-110.2H32.4v69.2C76.4 482.8 168.5 544.3 272 544.3z"
          />
          <path
            fill="#FBBC05"
            d="M121.3 326.3c-10.2-30-10.2-62.5 0-92.5V164.6H32.4c-40.5 80.4-40.5 175.1 0 255.6l88.9-69.5z"
          />
          <path
            fill="#EA4335"
            d="M272 107.7c39.5-.6 77.4 14.5 106.2 41.8l79.2-79.2C413.3 24.3 346.2-.4 272 0 168.5 0 76.4 61.5 32.4 164.6l88.9 69.2C142.6 154.9 202 107.7 272 107.7z"
          />
        </svg>
        <span className="font-medium text-gray-700">Continue with Google</span>
      </button>
    </>
  );
};

export default LoginContent;
