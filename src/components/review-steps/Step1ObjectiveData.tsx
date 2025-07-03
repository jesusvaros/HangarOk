import React from 'react';
import { useFormContext } from '../../store/useFormContext';

interface Step1Props {
  onNext: () => void;
}

const Step1ObjectiveData: React.FC<Step1Props> = ({ onNext }) => {
  const { address, formData, updateFormData } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-center">Datos Objetivos</h2>
      
      {/* Sección: Dirección */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Dirección</h3>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Dirección completa
          </label>
          <input
            id="address"
            type="text"
            value={formData.address || address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Calle, número, ciudad"
          />
        </div>
      </div>
      
      {/* Sección: Precio del alquiler */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium mb-4 text-orange-500">Precio del alquiler</h3>
        <div className="mb-4">
          <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Precio mensual (€)
          </label>
          <input
            id="rentalPrice"
            type="number"
            value={formData.rentalPrice || ''}
            onChange={(e) => updateFormData({ rentalPrice: parseFloat(e.target.value) || 0 })}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ej: 800"
          />
        </div>
        
        <div className="mb-4 mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de propietario
          </label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="owner"
                checked={formData.ownerType === 'owner'}
                onChange={() => updateFormData({ ownerType: 'owner' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Propietario</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="agency"
                checked={formData.ownerType === 'agency'}
                onChange={() => updateFormData({ ownerType: 'agency' })}
                className="h-5 w-5 text-orange-500"
              />
              <span className="ml-2 text-base">Agencia</span>
            </label>
          </div>
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
