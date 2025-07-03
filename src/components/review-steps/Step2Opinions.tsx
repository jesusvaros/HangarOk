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
      <h2 className="text-xl font-semibold mb-4">Opiniones</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valoración del {formData.ownerType === 'owner' ? 'propietario' : 'agencia'} (1-5)
        </label>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={formData.ownerRating || 3}
            onChange={(e) => updateFormData({ ownerRating: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm">5</span>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios
        </label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments || ''}
          onChange={(e) => updateFormData({ comments: e.target.value })}
          rows={4}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Comparte tu experiencia con este propietario/agencia..."
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado de la propiedad (1-5)
        </label>
        <div className="flex items-center gap-4">
          <span className="text-sm">1</span>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={formData.propertyConditionRating || 3}
            onChange={(e) => updateFormData({ propertyConditionRating: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm">5</span>
        </div>
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
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step2Opinions;
