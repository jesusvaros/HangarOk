// ContactModal.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionIdBack } from '../../services/sessionManager';
import { useFormContext } from '../../store/useFormContext';
import { supabaseWrapper } from '../../services/supabase/client';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { formData, updateFormData } = useFormContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'loading' | 'link-sent' | 'error'>('idle');
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

  // Check Supabase session and redirect to review page if user is already validated
  const checkUserSession = useCallback(async () => {
    const client = supabaseWrapper.getClient();
    if (!client) return;
    const {
      data: { session },
    } = await client.auth.getSession();
    if (!session) return;
    const sessionId = await getSessionIdBack();
    navigate(sessionId ? `/review/${sessionId}` : '/');
  }, [navigate]);

  // Listen to localStorage changes from another tab / window (magic link opened)
  useEffect(() => {
    // Initial session check on mount
    checkUserSession();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'supabase.auth.token') {
        checkUserSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkUserSession]);

  // Periodically poll session in case storage event is missed
  useEffect(() => {
    const interval = setInterval(() => {
      checkUserSession();
    }, 15000);
    return () => clearInterval(interval);
  }, [checkUserSession]);

  // Function to send the magic link (OTP) email
  const sendEmailOtp = async () => {
    const client = supabaseWrapper.getClient();
    if (!client || !formData.contactEmail) {
      setStatus('error');
      setErrorMessage('Introduce un correo electrónico válido.');
      return;
    }

    setStatus('loading');
    const { error } = await client.auth.signInWithOtp({
      email: formData.contactEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('link-sent');
      setResendTimer(30);
      setCanResend(false);
    }
  };

  // Wrapper to keep form submit signature
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailOtp();
  };

  const handleGoogleLogin = async () => {
    const client = supabaseWrapper.getClient();
    if (!client) return;

    await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="mb-4 text-2xl font-bold text-gray-800">Guardar y validar tu opinión</h2>

        <p className="mb-4 text-base text-gray-700">
          Para completar tu opinión, necesitamos confirmar tu email:
        </p>

        {status === 'idle' || status === 'error' ? (
          <>
            <ul className="mb-6 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>
                ✉️ <span className="font-semibold">No se mostrará públicamente.</span>
              </li>
              <li>
                🕵️ Tu review seguirá siendo completamente{' '}
                <span className="font-semibold">anónima.</span>
              </li>
              <li>
                🔒{' '}
                <span className="font-semibold">
                  Solo lo usamos para verificar que eres una persona real
                </span>{' '}
                y para que{' '}
                <span className="font-semibold">
                  puedas editar o borrar tu review en el futuro.
                </span>
              </li>
            </ul>
            <form onSubmit={handleEmailLogin}>
              <div className="mb-4">
                <label
                  htmlFor="contactEmail"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  value={formData.contactEmail || ''}
                  onChange={e => updateFormData({ contactEmail: e.target.value })}
                  required
                  className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)]"
                  placeholder="tu@email.com"
                />
              </div>

              {status === 'error' && (
                <p className="mb-2 text-sm text-red-600">
                  {errorMessage || 'Error al enviar el link'}
                </p>
              )}

              <button
                type="submit"
                className="mb-3 w-full rounded-lg bg-[rgb(74,94,50)] py-2 text-white hover:bg-[rgb(60,76,40)]"
              >
                Validar por correo
              </button>
            </form>
          </>
        ) : status === 'loading' ? (
          <p className="text-center text-sm text-gray-600">Enviando enlace de login...</p>
        ) : (
          <div className="mb-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
            {isEditingEmail ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setIsEditingEmail(false);
                  sendEmailOtp();
                }}
                className="space-y-2"
              >
                <input
                  type="email"
                  className="w-full rounded-lg border p-2 text-sm"
                  value={formData.contactEmail}
                  onChange={e => updateFormData({ contactEmail: e.target.value })}
                />
                <button
                  type="submit"
                  className="w-full rounded bg-[rgb(74,94,50)] py-2 text-white hover:bg-[rgb(60,76,40)]"
                >
                  Enviar nuevo enlace
                </button>
              </form>
            ) : (
              <>
                <p className="mb-2">
                  📩 Hemos enviado un enlace a{' '}
                  <span className="font-semibold">{formData.contactEmail}</span>.
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    Cambiar email
                  </button>
                  <button
                    onClick={() => {
                      sendEmailOtp();
                    }}
                    disabled={!canResend}
                    className={`text-sm ${canResend ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                  >
                    {canResend ? 'Reenviar enlace' : `Reenviar en ${resendTimer}s`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="my-2 mb-4 flex items-center justify-center">
          <span className="mx-2 text-sm text-gray-500">ó</span>
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
          <span className="font-medium text-gray-700">Continuar con Google</span>
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
