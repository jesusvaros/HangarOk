import React from 'react';

interface EmailConfirmationProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  setEmail,
  onSubmit,
  onBack,
}) => {
  return (
    <div>
      <h2 className="mb-6 text-center text-xl font-semibold">Confirmación</h2>

      {/* Sección: Verificación por email */}
      <div className="mb-8 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-4 text-lg font-medium text-orange-500">Verificación por email</h3>

        <p className="mb-4 text-gray-600">
          Para confirmar tu opinión, por favor introduce tu dirección de email. No se publicará y
          solo se utilizará para verificar tu opinión.
        </p>

        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
            Email de contacto
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      {/* Sección: Resumen de la opinión */}
      <div className="mb-8 rounded-lg border border-gray-200 p-4">
        <h3 className="mb-4 text-lg font-medium text-orange-500">Resumen de tu opinión</h3>

        <p className="mb-4 text-gray-600">
          Revisa tu opinión antes de enviarla. Una vez enviada, recibirás un correo de confirmación
          para verificar tu identidad.
        </p>
      </div>

      <div className="mt-4 flex justify-between">
        <button type="button" onClick={onBack} className="text-orange-500 hover:text-orange-600">
          Volver
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="rounded bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        >
          Enviar Opinión
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmation;
