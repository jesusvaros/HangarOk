// ContactModal.tsx
import React, { useEffect, useState } from 'react';
import { useFormContext } from '../../store/useFormContext';
import { supabaseWrapper } from '../../services/supabase/client';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { formData, updateFormData } = useFormContext();
  const [status, setStatus] = useState<'idle' | 'loading' | 'link-sent' | 'error'>('link-sent');
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
                🕵️{' '}
                <span className="font-semibold">
                  Tu review seguirá siendo completamente anónima.
                </span>
              </li>
              <li>
                🔒{' '}
                <span className="font-semibold">
                  Solo lo usamos para verificar que eres una persona real
                </span>{' '}
                y para que
                <span className="font-semibold">
                  {' '}
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
                <p className="mb-3">
                  Ábrelo para continuar y{' '}
                  <span className="font-semibold">guardar tu opinión de forma segura</span>.
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

        <div className="my-4 flex items-center justify-center">
          <span className="mx-2 text-sm text-gray-500">ó</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          <img src="/google-icon.svg" alt="Google" className="mr-2 h-5 w-5" />
          <span className="font-medium text-gray-700">Continuar con Google</span>
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
