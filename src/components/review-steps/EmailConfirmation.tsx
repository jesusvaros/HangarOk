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
      <h2 className="text-xl font-semibold mb-4">Confirmación por Email</h2>
      <p className="mb-4 text-gray-600">
        Para confirmar tu opinión, por favor introduce tu dirección de email. 
        No se publicará y solo se utilizará para verificar tu opinión.
      </p>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="tu@email.com"
        />
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
