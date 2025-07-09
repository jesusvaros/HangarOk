import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTag from '../ui/SelectableTag';
import CustomTextarea from '../ui/CustomTextarea';

interface Step3Props {
  onNext: () => void;
  onPrevious: () => void;
}

const Step3PropertyCondition: React.FC<Step3Props> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      {/* Temperatura en verano */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">Temperatura en verano</h3>
        <div className="flex flex-wrap gap-3">
          {['Bien aislado', 'Correcto', 'Caluroso'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.summerTemperature === option}
              onClick={() => updateFormData({ summerTemperature: option as 'Bien aislado' | 'Correcto' | 'Caluroso' })}
            />
          ))}
        </div>
      </div>

      {/* Temperatura en invierno */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">Temperatura en invierno</h3>
        <div className="flex flex-wrap gap-3">
          {['Bien aislado', 'Correcto', 'Frío'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.winterTemperature === option}
              onClick={() => updateFormData({ winterTemperature: option as 'Bien aislado' | 'Correcto' | 'Frío' })}
            />
          ))}
        </div>
      </div>

      {/* Nivel de ruido */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">Nivel de ruido</h3>
        <div className="flex flex-wrap gap-3">
          {['Silencioso', 'Tolerable', 'Bastante', 'Se oye todo'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.noiseLevel === option}
              onClick={() => updateFormData({ noiseLevel: option as 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo' })}
            />
          ))}
        </div>
      </div>

      {/* Nivel de luz */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">Nivel de luz</h3>
        <div className="flex flex-wrap gap-3">
          {['Nada de luz', 'Poca luz', 'Luminoso', 'Muy luminoso'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.lightLevel === option}
              onClick={() => updateFormData({ lightLevel: option as 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso' })}
            />
          ))}
        </div>
      </div>

      {/* Estado de mantenimiento */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">Estado de mantenimiento</h3>
        <div className="flex flex-wrap gap-3">
          {['Como nuevo', 'Bueno', 'Aceptable', 'Poco', 'Malo'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.maintenanceStatus === option}
              onClick={() => updateFormData({ maintenanceStatus: option as 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo' })}
            />
          ))}
        </div>
      </div>

      {/* Opinión sobre el piso */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3 text-black">¿Quieres añadir algo más sobre el piso?</h3>
        <CustomTextarea
          id="propertyOpinion"
          value={formData.propertyOpinion || ''}
          onChange={(e) => updateFormData({ propertyOpinion: e.target.value })}
          placeholder="Comparte tu experiencia y opinión sobre el piso..."
          rows={5}
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="bg-[rgb(74,94,50)] text-white py-2 px-6 rounded hover:bg-[rgb(60,76,40)]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step3PropertyCondition;
