import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface Step2Props {
  onNext: () => void;
  onPrev: () => void;
}

const Step2Opinions: React.FC<Step2Props> = ({ onNext, onPrev }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Experiencia</h2>
      
      {/* Sección: Valoración del propietario/agencia */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Valoración del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Cómo calificarías al {formData.ownerType === 'owner' ? 'propietario' : 'agencia'}? (1-5)
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Muy malo</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={formData.ownerRating || 3}
              onChange={(e) => updateFormData({ ownerRating: parseInt(e.target.value) })}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">Excelente</span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
            Comparte tu experiencia
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments || ''}
            onChange={(e) => updateFormData({ comments: e.target.value })}
            rows={4}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="¿Cómo fue tu experiencia con este propietario/agencia? ¿Fue comunicativo? ¿Respetuoso?"
          ></textarea>
        </div>
      </div>
      
      {/* Sección: Estado de la propiedad */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Estado de la propiedad</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿En qué condiciones estaba la vivienda? (1-5)
          </label>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Muy malo</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={formData.propertyConditionRating || 3}
              onChange={(e) => updateFormData({ propertyConditionRating: parseInt(e.target.value) })}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium">Excelente</span>
          </div>
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
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step2Opinions;
