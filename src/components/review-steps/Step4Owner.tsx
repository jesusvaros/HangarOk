import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';

interface Step4Props {
  onNext: () => void;
  onPrevious: () => void;
}

const Step4Owner: React.FC<Step4Props> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      {/* Sección: Tipo de propietario */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Tipo de propietario</h3>
        
        <div className="mb-4">
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="Particular"
                checked={formData.ownerType === 'Particular'}
                onChange={() => updateFormData({ ownerType: 'Particular' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Propietario</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="Agencia"
                checked={formData.ownerType === 'Agencia'}
                onChange={() => updateFormData({ ownerType: 'Agencia' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Agencia</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Sección: Datos del propietario/agencia */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Datos del {formData.ownerType === 'Particular' ? 'propietario' : 'agencia'}</h3>
        
        <CustomInput
          id="ownerName"
          label="Nombre completo"
          value={formData.ownerName || ''}
          onChange={(e) => updateFormData({ ownerName: e.target.value })}
          placeholder={`Nombre del ${formData.ownerType === 'Particular' ? 'propietario' : 'agencia'}`}
        />
      </div>
      
      {/* Sección: Información de contacto */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Información de contacto</h3>
        
        <CustomInput
          id="ownerPhone"
          label="Teléfono de contacto"
          type="tel"
          value={formData.ownerPhone || ''}
          onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
          placeholder="Ej: 600123456"
        />
        
        <div className="mt-4">
          <CustomInput
            id="ownerEmail"
            label="Correo electrónico"
            type="email"
            value={formData.ownerEmail || ''}
            onChange={(e) => updateFormData({ ownerEmail: e.target.value })}
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="showOwnerContact"
            checked={formData.showOwnerContact || false}
            onChange={(e) => updateFormData({ showOwnerContact: e.target.checked })}
            className="h-5 w-5 text-orange-500 rounded"
          />
          <label htmlFor="showOwnerContact" className="ml-2 text-sm text-gray-700">
            Mostrar información de contacto públicamente
          </label>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onPrevious}
          className="text-orange-500 hover:text-orange-600"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default Step4Owner;
