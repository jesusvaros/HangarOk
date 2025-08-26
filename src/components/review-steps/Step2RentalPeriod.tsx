import React from 'react';
import Slider from '@mui/material/Slider';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import SelectableTagGroup from '../ui/SelectableTagGroup';

interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step2RentalPeriod: React.FC<Step2Props> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();
  

  return (
    <div>
      <div className="mb-8">
        {/* Rango de años con dos manejadores */}
        <div className="mb-6">
          {(() => {
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - 20;
            const maxYear = currentYear;

            // Normaliza valores por si vienen fuera de rango
            const start = Math.min(
              Math.max(formData.startYear ?? maxYear, minYear),
              maxYear
            );
            const endRaw = Math.min(
              Math.max((formData.endYear ?? maxYear), minYear),
              maxYear
            );
            const isLiving = formData.endYear === undefined;
            const endForUI = isLiving ? maxYear : endRaw;

            

            return (
              <div>
                <label className="mb-2 block text-lg font-medium text-black">
                  ¿Cuántos años has estado en este piso?
                </label>
                <div className="relative pt-6 pb-6 select-none mx-8">
                  <Slider
                    value={[start, endForUI]}
                    min={minYear}
                    max={maxYear}
                    step={1}
                    disableSwap
                    onChange={(_e: Event, val: number | number[], activeThumb: number) => {
                      const [s, e] = val as number[];
                      if (activeThumb === 0) {
                        // mover inicio, no superar fin
                        const newStart = Math.min(s, isLiving ? endForUI : endRaw);
                        if (!isLiving && newStart > endRaw) {
                          updateFormData({ startYear: newStart, endYear: newStart });
                        } else {
                          updateFormData({ startYear: newStart });
                        }
                      } else if (activeThumb === 1) {
                        if (isLiving) return; // no mover fin cuando vive actualmente
                        const newEnd = Math.max(e, start);
                        updateFormData({ endYear: newEnd });
                      }
                    }}
                    valueLabelDisplay="on"
                    valueLabelFormat={(v: number) => `${v}`}
                    sx={{
                      pointerEvents: 'none',
                      color: 'rgb(74,94,50)',
                      height: 10,
                      '& .MuiSlider-rail': { backgroundColor: '#D1D5DB', opacity: 1, pointerEvents: 'none' },
                      '& .MuiSlider-track': { border: 'none', pointerEvents: 'none' },
                      '& .MuiSlider-thumb': {
                        pointerEvents: 'auto',
                        bgcolor: '#fff',
                        border: '1px solid #D1D5DB',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        width: 56,
                        height: 32,
                        borderRadius: 8,
                        '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(74,94,50,0.08)' },
                      },
                      '& .MuiSlider-valueLabel': {
                        background: '#fff',
                        color: '#000',
                        border: '1px solid #D1D5DB',
                        borderRadius: 8,
                        top: '110%',
                        left: '-10%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        padding: '6px 10px',
                        fontSize: '1.125rem',
                        fontWeight: 500,
                        '&:before': { display: 'none' },
                        pointerEvents: 'none',
                      },
                    }}
                  />
                </div>
                {(fieldErrors?.startYear || fieldErrors?.endYear) && (
                  <p className="mt-2 text-sm text-red-600">Revisa el período seleccionado.</p>
                )}

                {/* Checkbox: Aún vivo aquí */}
                <div className="flex items-center gap-2">
                  <input
                    id="stillHere"
                    type="checkbox"
                    checked={isLiving}
                    onChange={(e) => {
                      if (e.target.checked) {
                        updateFormData({ endYear: undefined });
                      } else {
                        // Si se desmarca, fija el fin al año actual si no había ninguno
                        updateFormData({ endYear: endRaw || maxYear });
                      }
                    }}
                    className="h-4 w-4 text-[rgb(74,94,50)] focus:ring-[rgb(74,94,50)] border-gray-300 rounded"
                  />
                  <label htmlFor="stillHere" className="text-lg text-black font-medium">Aún vivo aquí</label>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Sección: Precio del alquiler */}
      <div className="mb-8">
        <CustomInput
          id="price"
          label="Cuanto pagas al mes de alquiler?(€)"
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

      {/* Sección: ¿Recomendarías este piso? (1-5, no numérico) */}
      <div className="mb-8">
        <SelectableTagGroup
          label="¿Recomendarías este piso?"
          options={['1', '2', '3', '4', '5']}
          selectedOptions={formData.wouldRecommend ? [formData.wouldRecommend] : []}
          onChange={(selected) => updateFormData({ wouldRecommend: (selected[0] as '1'|'2'|'3'|'4'|'5'|undefined) })}
          multiSelect={false}
          error={fieldErrors?.wouldRecommend}
        />
      </div>

      <div className="mt-4 flex justify-between">
        <button type="button" onClick={onPrevious} className="text-black hover:text-gray-800">
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)]"
        >
          {isSubmitting ? 'Enviando...' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Step2RentalPeriod;
