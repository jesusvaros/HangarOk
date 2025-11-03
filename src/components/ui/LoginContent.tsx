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
}

const LoginContent: React.FC<LoginContentProps> = ({ 
  onClose, 
  showTitle = true,
  onLoginComplete,
  showInfo = true,
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
        <h2 className="mb-3 text-3xl font-bold text-gray-800">Save and verify your review</h2>
      )}

      {showInfo && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-base text-amber-800">
          <p className="mb-1 font-semibold">Why we ask for this:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Only used to validate your review</li>
            <li>Always kept anonymous</li>
            <li>Lets you edit it later if needed</li>
          </ul>
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
              Verify via email
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
