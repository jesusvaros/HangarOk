import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import SelectableTagGroup from '../ui/SelectableTagGroup';

interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
}

const Step2RentalPeriod: React.FC<Step2Props> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Período de alquiler</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de inicio
          </label>
          <select
            value={formData.startYear || new Date().getFullYear()}
            onChange={(e) => updateFormData({ startYear: parseInt(e.target.value) })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año de fin (o actual si sigues viviendo)
          </label>
          <select
            value={formData.endYear || new Date().getFullYear()}
            onChange={(e) => updateFormData({ endYear: parseInt(e.target.value) })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={new Date().getFullYear()}>Actualmente</option>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Sección: Precio del alquiler */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Precio del alquiler</h3>
        <CustomInput
          id="price"
          label="Precio mensual (€)"
          type="number"
          value={formData.price || ''}
          onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
          placeholder="Ej: 800"
        />
        
        <div className="mt-6">
          <SelectableTagGroup
            label="Incluye:"
            options={['Luz', 'Agua', 'Comunidad', 'Gas', 'Garaje']}
            selectedOptions={formData.includedServices || []}
            onChange={(selected) => updateFormData({ includedServices: selected })}
            multiSelect={true}
          />
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
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Step2RentalPeriod;
