import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

const Step3Contact: React.FC<Step3Props> = ({ onNext, onPrev }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
      
      <div className="mb-4">
        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          value={formData.ownerName || ''}
          onChange={(e) => updateFormData({ ownerName: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre completo"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono de contacto
        </label>
        <input
          id="ownerPhone"
          name="ownerPhone"
          type="tel"
          value={formData.ownerPhone || ''}
          onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 600123456"
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onPrev}
          className="text-blue-600 hover:text-blue-800"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Step3Contact;
