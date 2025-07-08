import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';

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
    <div>
      {/* Sección: Dirección */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4">
          <h3 className="text-xl font-medium mb-4 md:mb-0 text-orange-500">Dirección</h3>
        </div>
        
        <CustomInput
          id="street"
          label="Calle y número"
          value={formData.addressDetails?.street || ''}
          onChange={(e) => handleAddressChange('street', e.target.value)}
          placeholder="Ej: Calle Mayor 25"
        />
        
        <div className="flex flex-wrap -mx-2">
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
