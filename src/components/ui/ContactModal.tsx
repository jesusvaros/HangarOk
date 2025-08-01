// ContactModal.tsx
import React, { useState } from 'react';
import { useFormContext } from '../../store/useFormContext';
import { supabaseWrapper } from '../../services/supabase/client';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { formData, updateFormData } = useFormContext();
  const [status, setStatus] = useState<'idle' | 'loading' | 'link-sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contactEmail) {
      setStatus('error');
      setErrorMessage('Introduce un correo electrónico válido.');
      return;
    }

    const client = supabaseWrapper.getClient();
    if (!client) {
      setStatus('error');
      setErrorMessage('Error de configuración de Supabase.');
      return;
    }

    setStatus('loading');
    console.log('email', formData.contactEmail,`${window.location.origin}/auth/callback`);
    const { error } = await client.auth.signInWithOtp({
      email: formData.contactEmail,
      options: { shouldCreateUser: true ,
        emailRedirectTo: `${window.location.origin}/auth/callback`},
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('link-sent');
    }
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
        <h2 className="mb-4 text-xl font-semibold">Valida tu contacto</h2>

        <p className="mb-3 text-sm text-gray-600">
          Necesitamos validar tu identidad para enviar y poder editar tu reseña.
        </p>

        {status === 'idle' || status === 'error' ? (
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label htmlFor="contactEmail" className="mb-1 block text-sm font-medium text-gray-700">
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
              <p className="mb-2 text-sm text-red-600">{errorMessage || 'Error al enviar el link'}</p>
            )}

            <button
              type="submit"
              className="mb-3 w-full rounded-lg bg-[rgb(74,94,50)] py-2 text-white hover:bg-[rgb(60,76,40)]"
            >
              Validar por correo
            </button>
          </form>
        ) : status === 'loading' ? (
          <p className="text-center text-sm text-gray-600">Enviando enlace de login...</p>
        ) : (
          <p className="text-center text-sm text-gray-600">
            📩 Hemos enviado un enlace a <b>{formData.contactEmail}</b>. Ábrelo para continuar.
          </p>
        )}

        <div className="my-4 flex items-center justify-center">
          <span className="mx-2 text-sm text-gray-500">ó</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          <img src="/google-icon.svg" alt="Google" className="mr-2 h-5 w-5" />
          Continuar con Google
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
