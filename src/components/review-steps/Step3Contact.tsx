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
      <h2 className="text-xl font-semibold mb-6 text-center">Información sensible</h2>
      
      {/* Sección: Datos del propietario/agencia */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Datos del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}</h3>
        
        <div className="mb-4">
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            id="ownerName"
            name="ownerName"
            type="text"
            value={formData.ownerName || ''}
            onChange={(e) => updateFormData({ ownerName: e.target.value })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Nombre del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}"
          />
        </div>
      </div>
      
      {/* Sección: Información de contacto */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Información de contacto</h3>
        
        <div className="mb-4">
          <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono de contacto
          </label>
          <input
            id="ownerPhone"
            name="ownerPhone"
            type="tel"
            value={formData.ownerPhone || ''}
            onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ej: 600123456"
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onPrev}
          className="text-orange-500 hover:text-orange-600"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Step3Contact;
