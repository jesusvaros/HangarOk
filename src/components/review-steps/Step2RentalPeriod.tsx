import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import SelectableTagGroup from '../ui/SelectableTagGroup';

interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

const Step2RentalPeriod: React.FC<Step2Props> = ({ onNext, onPrevious, fieldErrors }) => {
  const { formData, updateFormData } = useFormContext();
  const isCurrentlyLiving = formData.endYear === null || formData.endYear === undefined;

  return (
    <div>
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-black">Período de alquiler</h3>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="mb-4 md:mb-0 md:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Año de inicio</label>
              <select
                value={formData.startYear || new Date().getFullYear()}
                onChange={e => updateFormData({ startYear: parseInt(e.target.value) })}
                className={`w-full rounded border p-3 focus:outline-none focus:ring-2  ${fieldErrors?.startYear ? 'bg-red-100 border-red-400' : 'focus:ring-[rgb(74,94,50)]'}`}
              >
                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-1/2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Año de fin (o actual si sigues viviendo)
              </label>
              <select
                value={isCurrentlyLiving ? 'current' : formData.endYear || new Date().getFullYear()}
                onChange={e => {
                  const value = e.target.value;
                  if (value === 'current') {
                    updateFormData({ endYear: undefined });
                  } else {
                    updateFormData({ endYear: parseInt(value) });
                  }
                }}
                className={`w-full rounded border p-3 focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] ${fieldErrors?.endYear ? 'bg-red-100 border-red-400' : ''}`}
              >
                <option value="current">Actualmente</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Precio del alquiler */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-black">Precio del alquiler</h3>
        <CustomInput
          id="price"
          label="Precio mensual (€)"
          type="number"
          value={formData.price || ''}
          onChange={e => updateFormData({ price: parseFloat(e.target.value) || 0 })}
          placeholder="Ej: 800"
          error={fieldErrors?.montlyPrice}
        />

        <div className="mt-6">
          <SelectableTagGroup
            label="Incluye:"
            options={['Luz', 'Agua', 'Comunidad', 'Gas', 'Garaje']}
            selectedOptions={formData.includedServices || []}
            onChange={selected => updateFormData({ includedServices: selected })}
            multiSelect={true}
          />
        </div>
      </div>

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

export default Step2RentalPeriod;
