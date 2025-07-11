import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTag from '../ui/SelectableTag';
import CustomTextarea from '../ui/CustomTextarea';

interface Step4CommunityProps {
  onNext: () => void;
  onPrevious: () => void;
}

const Step4Community: React.FC<Step4CommunityProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();

  // Los mensajes ahora se manejan a través de StaticFormMessagesContainer

  // Helper function to handle multi-select options
  const handleMultiSelectToggle = (
    field: 'neighborTypes' | 'communityEnvironment',
    value: string,
  ) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateFormData({ [field]: newValues });
  };

  // Helper function to check if a value is selected in multi-select
  const isSelected = (field: 'neighborTypes' | 'communityEnvironment', value: string) => {
    return (formData[field] || []).includes(value);
  };

  return (
    <div>
      {/* Tipos de vecinos */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <h3 className="text-lg font-medium text-black">
            ¿Cómo definirías la escalera de vecinos?
          </h3>
          <span className="ml-2 text-xs text-gray-500">Elige tantas como quieras</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            'Familiar',
            'Parejas jóvenes',
            'Pisos de estudiantes',
            'Pisos compartidos',
            'Mayores +75 años',
          ].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={isSelected('neighborTypes', option)}
              onClick={() => handleMultiSelectToggle('neighborTypes', option)}
            />
          ))}
        </div>
      </div>

      {/* Pisos turísticos */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <h3 className="text-lg font-medium text-black">Pisos turísticos en el edificio</h3>
          <span className="ml-2 text-xs text-gray-500">Opcional</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Sí, tolerable', 'Sí, molestos', 'No hay'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.touristApartments === option}
              onClick={() =>
                updateFormData({
                  touristApartments: option as 'Sí, tolerable' | 'Sí, molestos' | 'No hay',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Limpieza del edificio */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <h3 className="text-lg font-medium text-black">Limpieza del edificio</h3>
          <span className="ml-2 text-xs text-gray-500">Opcional</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Muy limpio', 'Buena', 'Poca', 'Sin limpieza'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.buildingCleanliness === option}
              onClick={() =>
                updateFormData({
                  buildingCleanliness: option as 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Ambiente del barrio */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <h3 className="text-lg font-medium text-black">Ambiente del barrio</h3>
          <span className="ml-2 text-xs text-gray-500">Elige al menos una opción</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Tranquilo', 'Lúdico/Festivo', 'Familiar', 'Estudiantil', 'Nocturno'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={isSelected('communityEnvironment', option)}
              onClick={() => handleMultiSelectToggle('communityEnvironment', option)}
            />
          ))}
        </div>
      </div>

      {/* Seguridad del barrio */}
      <div className="mb-6">
        <div className="mb-3 flex items-center">
          <h3 className="text-lg font-medium text-black">Seguridad del barrio</h3>
          <span className="ml-2 text-xs text-gray-500">Opcional</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Muy segura', 'Sin problemas', 'Mejorable', 'Poco segura'].map((option) => (
            <SelectableTag
              key={option}
              label={option}
              selected={formData.communitySecurity === option}
              onClick={() =>
                updateFormData({
                  communitySecurity: option as
                    | 'Muy segura'
                    | 'Sin problemas'
                    | 'Mejorable'
                    | 'Poco segura',
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Opinión sobre la comunidad y el barrio */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-black">
          Tu opinión sobre la comunidad y el barrio
        </h3>
        <CustomTextarea
          id="communityOpinion"
          value={formData.communityOpinion || ''}
          onChange={(e) => updateFormData({ communityOpinion: e.target.value })}
          placeholder="Comparte tu experiencia y opinión sobre la comunidad y el barrio..."
          rows={5}
        />
      </div>

      {/* Navigation buttons */}
      <div className="mt-4 flex justify-between">
        <button type="button" onClick={onPrevious} className="text-black hover:text-gray-800">
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)]"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step4Community;
