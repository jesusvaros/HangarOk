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
      contactEmail: formData.contactEmail || '',
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="mb-4 text-xl font-semibold">Tus datos de contacto</h2>
        <div className="mb-4 text-gray-600">
          <p className="mb-2">Recuerda:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Solo será usada para validar la review</li>
            <li>Siempre será anónima</li>
            <li>Te permitirá editarla si fuera necesario</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={formData.contactName || ''}
              onChange={(e) => updateFormData({ contactName: e.target.value })}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)]"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              value={formData.contactEmail || ''}
              onChange={(e) => updateFormData({ contactEmail: e.target.value })}
              className="w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)]"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-lg bg-[rgb(74,94,50)] px-4 py-2 text-white hover:bg-[rgb(60,76,40)]"
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
