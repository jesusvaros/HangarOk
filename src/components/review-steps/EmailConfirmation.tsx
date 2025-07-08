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
  onBack 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Confirmación</h2>
      
      {/* Sección: Verificación por email */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Verificación por email</h3>
        
        <p className="mb-4 text-gray-600">
          Para confirmar tu opinión, por favor introduce tu dirección de email. 
          No se publicará y solo se utilizará para verificar tu opinión.
        </p>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email de contacto
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="tu@email.com"
          />
        </div>
      </div>
      
      {/* Sección: Resumen de la opinión */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Resumen de tu opinión</h3>
        
        <p className="mb-4 text-gray-600">
          Revisa tu opinión antes de enviarla. Una vez enviada, recibirás un correo de confirmación
          para verificar tu identidad.
        </p>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onBack}
          className="text-orange-500 hover:text-orange-600"
        >
          Volver
        </button>
        <button 
          type="button" 
          onClick={onSubmit}
          className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
        >
          Enviar Opinión
        </button>
      </div>
    </div>
  );
};

export default EmailConfirmation;
