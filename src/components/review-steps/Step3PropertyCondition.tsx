import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTag from '../ui/SelectableTag';
import CustomTextarea from '../ui/CustomTextarea';
import { umamiEventProps } from '../../utils/analytics';

interface Step3Props {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step3PropertyCondition: React.FC<Step3Props> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const titleAndError = (title: string, error?: boolean) => {
    return (
      <div className="mb-3 flex items-center gap-2">
        <h3 className="mb-3 text-lg font-medium text-black">{title}</h3>
        {error && <p className="mb-2 text-red-500 text-xs">Por favor, selecciona una opción.</p>}
      </div>
    );
  };

  return (
    <div>
      {/* Temperatura en verano */}
      <div className="mb-6">
        {titleAndError('Temperatura en verano', fieldErrors?.summerTemperature)}
        <div className="flex flex-wrap gap-3">
          {['Bien aislado', 'Correcto', 'Caluroso'].map(option => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.summerTemperature === option}
              onClick={() =>
                updateFormData({
                  summerTemperature: option as 'Bien aislado' | 'Correcto' | 'Caluroso',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Temperatura en invierno */}
      <div className="mb-6">
        {titleAndError('Temperatura en invierno', fieldErrors?.winterTemperature)}
        <div className="flex flex-wrap gap-3">
          {['Bien aislado', 'Correcto', 'Frío'].map(option => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.winterTemperature === option}
              onClick={() =>
                updateFormData({
                  winterTemperature: option as 'Bien aislado' | 'Correcto' | 'Frío',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Nivel de ruido */}
      <div className="mb-6">
        {titleAndError('Nivel de ruido', fieldErrors?.noiseLevel)}
        <div className="flex flex-wrap gap-3">
          {['Silencioso', 'Tolerable', 'Bastante', 'Se oye todo'].map(option => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.noiseLevel === option}
              onClick={() =>
                updateFormData({
                  noiseLevel: option as 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Nivel de luz */}
      <div className="mb-6">
        {titleAndError('Nivel de luz', fieldErrors?.lightLevel)}
        <div className="flex flex-wrap gap-3">
          {['Nada de luz', 'Poca luz', 'Luminoso', 'Muy luminoso'].map(option => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.lightLevel === option}
              onClick={() =>
                updateFormData({
                  lightLevel: option as 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Estado de mantenimiento */}
      <div className="mb-6">
        {titleAndError('Estado de mantenimiento', fieldErrors?.maintenanceStatus)}
        <div className="flex flex-wrap gap-3">
          {['Como nuevo', 'Bueno', 'Aceptable', 'Poco', 'Malo'].map(option => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.maintenanceStatus === option}
              onClick={() =>
                updateFormData({
                  maintenanceStatus: option as
                    | 'Como nuevo'
                    | 'Bueno'
                    | 'Aceptable'
                    | 'Poco'
                    | 'Malo',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Opinión sobre el piso */}
      <div className="mb-6">
        {titleAndError('Opinión sobre el piso', fieldErrors?.propertyOpinion)}
        <CustomTextarea
          id="propertyOpinion"
          value={formData.propertyOpinion || ''}
          onChange={e => updateFormData({ propertyOpinion: e.target.value })}
          placeholder="Comparte tu experiencia y opinión sobre el piso..."
          rows={5}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
          {...umamiEventProps('review:step3-previous')}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)]"
          {...umamiEventProps('review:step3-next')}
        >
          {isSubmitting ? 'Enviando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Step3PropertyCondition;
