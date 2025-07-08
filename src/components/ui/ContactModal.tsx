import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface ContactModalProps {
  onClose: () => void;
  onSubmit: (contactData: { contactName: string; contactEmail: string }) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmit }) => {
  const { formData, updateFormData } = useFormContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      contactName: formData.contactName || '',
      contactEmail: formData.contactEmail || ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Tus datos de contacto</h2>
        <p className="text-gray-600 mb-4 text-center">
          Para finalizar tu reseña, por favor proporciona tus datos de contacto.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={formData.contactName || ''}
              onChange={(e) => updateFormData({ contactName: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tu nombre"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={formData.contactEmail || ''}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Enviar reseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
