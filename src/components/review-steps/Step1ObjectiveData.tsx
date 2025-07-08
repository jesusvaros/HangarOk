import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import SelectableTagGroup from '../ui/SelectableTagGroup';

interface Step1Props {
  onNext: () => void;
}

const Step1ObjectiveData: React.FC<Step1Props> = ({ onNext }) => {
  const { formData, updateFormData } = useFormContext();
  
  const handleAddressChange = (field: string, value: string) => {
    updateFormData({
      addressDetails: {
        ...formData.addressDetails || {},
        [field]: value
      }
    });
  };
  
  return (
    <div className="">
      
      {/* Sección: Dirección */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4">
          <h3 className="text-xl font-medium mb-4 md:mb-0 text-orange-500">Dirección</h3>
        </div>
        
        <CustomInput
          id="streetAddress"
          label="Calle y número"
          value={formData.addressDetails?.streetAddress || ''}
          onChange={(e) => handleAddressChange('streetAddress', e.target.value)}
          placeholder="Ej: Calle Mayor 25"
        />
        
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/3 px-2">
            <CustomInput
              id="staircase"
              label="Escalera"
              value={formData.addressDetails?.staircase || ''}
              onChange={(e) => handleAddressChange('staircase', e.target.value)}
              placeholder="Escalera"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <CustomInput
              id="floor"
              label="Piso"
              value={formData.addressDetails?.floor || ''}
              onChange={(e) => handleAddressChange('floor', e.target.value)}
              placeholder="Piso"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <CustomInput
              id="door"
              label="Puerta"
              value={formData.addressDetails?.door || ''}
              onChange={(e) => handleAddressChange('door', e.target.value)}
              placeholder="Puerta"
            />
          </div>
        </div>
      </div>
      
      {/* Sección: Precio del alquiler */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Precio del alquiler</h3>
        <CustomInput
          id="rentalPrice"
          label="Precio mensual (€)"
          type="number"
          value={formData.rentalPrice || ''}
          onChange={(e) => updateFormData({ rentalPrice: parseFloat(e.target.value) || 0 })}
          placeholder="Ej: 800"
        />
        
        <div className="mt-4">
          <SelectableTagGroup
            label="Incluye:"
            options={['Luz', 'Agua', 'Comunidad', 'Gas', 'Garaje']}
            selectedOptions={formData.includedUtilities || []}
            onChange={(selected) => updateFormData({ includedUtilities: selected })}
            multiSelect={true}
          />
        </div>
      </div>
      
      {/* Sección: Periodo de alquiler */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Periodo de alquiler</h3>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año de inicio
            </label>
            <select
              value={formData.rentalPeriod?.startYear || new Date().getFullYear()}
              onChange={(e) => updateFormData({ 
                rentalPeriod: { 
                  ...formData.rentalPeriod, 
                  startYear: parseInt(e.target.value) 
                } 
              })}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={`start-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div className="hidden sm:block text-gray-500">hasta</div>
          
          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año de finalización
            </label>
            <select
              value={formData.rentalPeriod?.endYear || new Date().getFullYear()}
              onChange={(e) => updateFormData({ 
                rentalPeriod: { 
                  ...formData.rentalPeriod, 
                  endYear: parseInt(e.target.value) 
                } 
              })}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={`end-${year}`} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
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

export default Step1ObjectiveData;
