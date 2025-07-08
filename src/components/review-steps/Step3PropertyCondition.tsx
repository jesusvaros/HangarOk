import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface Step3Props {
  onNext: () => void;
  onPrevious: () => void;
}

const Step3PropertyCondition: React.FC<Step3Props> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        {/* Temperatura en verano */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Temperatura en verano</h3>
          <div className="flex flex-wrap gap-3">
            {['Bien aislado', 'Correcto', 'Caluroso'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="summerTemperature"
                  value={option}
                  checked={formData.summerTemperature === option}
                  onChange={() => updateFormData({ summerTemperature: option as 'Bien aislado' | 'Correcto' | 'Caluroso' })}
                  className="h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Temperatura en invierno */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Temperatura en invierno</h3>
          <div className="flex flex-wrap gap-3">
            {['Bien aislado', 'Correcto', 'Frío'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="winterTemperature"
                  value={option}
                  checked={formData.winterTemperature === option}
                  onChange={() => updateFormData({ winterTemperature: option as 'Bien aislado' | 'Correcto' | 'Frío' })}
                  className="h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de ruido */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Nivel de ruido</h3>
          <div className="flex flex-wrap gap-3">
            {['Silencioso', 'Tolerable', 'Bastante', 'Se oye todo'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="noiseLevel"
                  value={option}
                  checked={formData.noiseLevel === option}
                  onChange={() => updateFormData({ noiseLevel: option as 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo' })}
                  className="h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de luz */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Nivel de luz</h3>
          <div className="flex flex-wrap gap-3">
            {['Nada de luz', 'Poca luz', 'Luminoso', 'Muy luminoso'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="lightLevel"
                  value={option}
                  checked={formData.lightLevel === option}
                  onChange={() => updateFormData({ lightLevel: option as 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso' })}
                  className="h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-base">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Estado de mantenimiento */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3 text-orange-500">Estado de mantenimiento</h3>
          <div className="flex flex-wrap gap-3">
            {['Como nuevo', 'Bueno', 'Aceptable', 'Poco', 'Malo'].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="maintenanceStatus"
                  value={option}
                  checked={formData.maintenanceStatus === option}
                  onChange={() => updateFormData({ maintenanceStatus: option as 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo' })}
                  className="h-5 w-5 text-orange-500"
                />
                <span className="ml-2 text-base">{option}</span>
              </label>
            ))}
          </div>
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
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default Step3PropertyCondition;
