import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface Step1Props {
  onNext: () => void;
}

const Step1ObjectiveData: React.FC<Step1Props> = ({ onNext }) => {
  const { address, formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Datos Objetivos</h2>
      
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          value={formData.address || address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Calle, número, ciudad"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700 mb-1">
          Precio del alquiler (€/mes)
        </label>
        <input
          id="rentalPrice"
          type="number"
          value={formData.rentalPrice || ''}
          onChange={(e) => updateFormData({ rentalPrice: parseFloat(e.target.value) || 0 })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: 800"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de propietario
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="ownerType"
              value="owner"
              checked={formData.ownerType === 'owner'}
              onChange={() => updateFormData({ ownerType: 'owner' })}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Propietario</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="ownerType"
              value="agency"
              checked={formData.ownerType === 'agency'}
              onChange={() => updateFormData({ ownerType: 'agency' })}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2">Agencia</span>
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Periodo de alquiler
        </label>
        <div className="flex gap-4 items-center">
          <select
            value={formData.rentalPeriod?.startYear || new Date().getFullYear()}
            onChange={(e) => updateFormData({ 
              rentalPeriod: { 
                ...formData.rentalPeriod, 
                startYear: parseInt(e.target.value) 
              } 
            })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={`start-${year}`} value={year}>{year}</option>
            ))}
          </select>
          <span>hasta</span>
          <select
            value={formData.rentalPeriod?.endYear || new Date().getFullYear()}
            onChange={(e) => updateFormData({ 
              rentalPeriod: { 
                ...formData.rentalPeriod, 
                endYear: parseInt(e.target.value) 
              } 
            })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={`end-${year}`} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
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

export default Step1ObjectiveData;
