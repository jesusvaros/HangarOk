import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomTextarea from '../ui/CustomTextarea';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import CustomCheckbox from '../ui/CustomCheckbox';
import HashedContactInput from '../ui/HashedContactInput';

interface Step5OwnerProps {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step5Owner: React.FC<Step5OwnerProps> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const isOwnerTypeParticular = formData.ownerType === 'Particular';

  return (
    <div>
      {/* Sección: Tipo de propietario */}
      <div className="mb-8">
        <h3 className="mb-4 text-lg font-medium text-black">Tipo de propietario</h3>
        {fieldErrors?.ownerType && (
          <p className="text-red-500">Por favor, selecciona el tipo de propietario.</p>
        )}

        <SelectableTagGroup
          options={['Propietario', 'Agencia']}
          selectedOptions={[isOwnerTypeParticular ? 'Propietario' : 'Agencia']}
          onChange={selected => {
            if (selected.length > 0) {
              updateFormData({
                ownerType: selected[0] === 'Propietario' ? 'Particular' : 'Agencia',
              });
            }
          }}
          multiSelect={false}
        />
      </div>

      {/* Sección: Datos del propietario/agencia */}
      <div className="mb-8 ">
        <div className="flex items-end mb-4">
          <h3 className="text-lg font-medium text-black">
            Datos {isOwnerTypeParticular ? 'del propietario' : 'de la agencia'}
          </h3>
          {isOwnerTypeParticular && (
            <span className="ml-2 text-gray-500 text-sm mb-0.5">opcional</span>
          )}
        </div>
        <HashedContactInput
          id="ownerName"
          label="Nombre completo"
          type="text"
          value={formData.ownerName || ''}
          hashValue={formData.ownerNameHash || ''}
          onChange={(value: string) => updateFormData({ ownerName: value })}
          placeholder="Nombre completo"
        />
      </div>

      {/* Sección: Información de contacto */}
      <div className="relative mb-8">
        <div className="flex items-end mb-4">
          <h3 className=" text-lg font-medium text-black">Información de contacto</h3>
          {isOwnerTypeParticular && (
            <span className="ml-2 text-gray-500 text-sm mb-0.5">opcional</span>
          )}
        </div>

        <HashedContactInput
          id="ownerPhone"
          label="Teléfono de contacto"
          type="tel"
          value={formData.ownerPhone || ''}
          hashValue={formData.ownerPhoneHash || ''}
          onChange={(value: string) => updateFormData({ ownerPhone: value })}
          placeholder="Ej: 600123456"
        />

        <div className="mt-4">
          <HashedContactInput
            id="ownerEmail"
            label="Correo electrónico"
            type="email"
            value={formData.ownerEmail || ''}
            hashValue={formData.ownerEmailHash || ''}
            onChange={(value: string) => updateFormData({ ownerEmail: value })}
            placeholder="correo@ejemplo.com"
          />
        </div>
      </div>

      {/* Opinión sobre el propietario/agencia */}
      <div className="relative mb-8">
        <h3 className="mb-4 text-lg font-medium text-black">
          Tu opinión sobre {isOwnerTypeParticular ? 'el propietario' : 'la agencia'}
        </h3>
        <CustomTextarea
          id="ownerOpinion"
          value={formData.ownerOpinion || ''}
          onChange={e => updateFormData({ ownerOpinion: e.target.value })}
          placeholder={`Describe tu experiencia de manera honesta, respetuosa y basada en hechos reales. Evita incluir datos personales, insultos o amenazas.
`}
          rows={5}
        />

        <div className="mt-4">
          <CustomCheckbox
            id="checkboxReadTerms"
            label={
              <>
                He leído y acepto los{' '}
                <a
                  href="/terminosCondiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:text-[rgb(60,76,40)] ${fieldErrors?.checkboxReadTerms ? 'text-red-500' : 'text-[rgb(74,94,50)]'}`}
                >
                  términos y condiciones
                </a>
              </>
            }
            checked={Boolean(formData.checkboxReadTerms)}
            onChange={e => updateFormData({ checkboxReadTerms: e.target.checked })}
            error={fieldErrors?.checkboxReadTerms}
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
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)]"
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar'}
        </button>
      </div>
    </div>
  );
};

export default Step5Owner;
