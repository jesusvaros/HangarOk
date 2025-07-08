import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';

interface Step3Props {
  onNext: () => void;
  onPrev: () => void;
}

const Step3Contact: React.FC<Step3Props> = ({ onNext, onPrev }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Información sensible</h2>
      
      {/* Sección: Tipo de propietario */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Tipo de propietario</h3>
        
        <div className="mb-4">
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="owner"
                checked={formData.ownerType === 'owner'}
                onChange={() => updateFormData({ ownerType: 'owner' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Propietario</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="agency"
                checked={formData.ownerType === 'agency'}
                onChange={() => updateFormData({ ownerType: 'agency' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Agencia</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Sección: Datos del propietario/agencia */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Datos del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}</h3>
        
        <CustomInput
          id="ownerName"
          label="Nombre completo"
          value={formData.ownerName || ''}
          onChange={(e) => updateFormData({ ownerName: e.target.value })}
          placeholder={`Nombre del ${formData.ownerType === 'owner' ? 'propietario' : 'agencia'}`}
        />
      </div>
      
      {/* Sección: Información de contacto */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Información de contacto</h3>
        
        <CustomInput
          id="ownerPhone"
          label="Teléfono de contacto"
          type="tel"
          value={formData.ownerPhone || ''}
          onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
          placeholder="Ej: 600123456"
        />
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
