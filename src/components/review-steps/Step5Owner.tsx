import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import CustomInput from '../ui/CustomInput';
import CustomTextarea from '../ui/CustomTextarea';
import MessageBox from '../ui/MessageBox';

interface Step5OwnerProps {
  onNext: () => void;
  onPrevious: () => void;
}

const Step5Owner: React.FC<Step5OwnerProps> = ({ onNext, onPrevious }) => {
  const { formData, updateFormData } = useFormContext();
  
  return (
    <div>
      {/* Message box at the top */}
      <div className="relative">
        <MessageBox 
          message="Guardamos esta información para poder matchearla con la de idealista" 
          position="top" 
          type="info" 
          className="lg:absolute lg:right-[-24px] lg:translate-x-full lg:top-0 lg:w-48"
        />
      </div>

      {/* Sección: Tipo de propietario */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-black">Tipo de propietario</h3>
        
        <div className="mb-4">
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="Particular"
                checked={formData.ownerType === 'Particular'}
                onChange={() => updateFormData({ ownerType: 'Particular' })}
                className="h-5 w-5 text-black"
              />
              <span className="ml-2 text-base">Propietario</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ownerType"
                value="Agencia"
                checked={formData.ownerType === 'Agencia'}
                onChange={() => updateFormData({ ownerType: 'Agencia' })}
                className="h-5 w-5 text-black"
              />
              <span className="ml-2 text-base">Agencia</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Sección: Datos del propietario/agencia */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-black">Datos del {formData.ownerType === 'Particular' ? 'propietario' : 'agencia'}</h3>
        
        <CustomInput
          id="ownerName"
          label="Nombre completo"
          value={formData.ownerName || ''}
          onChange={(e) => updateFormData({ ownerName: e.target.value })}
          placeholder={`Nombre del ${formData.ownerType === 'Particular' ? 'propietario' : 'agencia'}`}
        />

      </div>
      
      {/* Sección: Información de contacto */}
      <div className="mb-8 relative">
        <h3 className="text-lg font-medium mb-4 text-black">Información de contacto</h3>

        <CustomInput
          id="ownerPhone"
          label="Teléfono de contacto"
          type="tel"
          value={formData.ownerPhone || ''}
          onChange={(e) => updateFormData({ ownerPhone: e.target.value })}
          placeholder="Ej: 600123456"
        />
        
        <div className="mt-4">
          <div className="relative">
            <CustomInput
              id="ownerEmail"
              label="Correo electrónico"
              type="email"
              value={formData.ownerEmail || ''}
              onChange={(e) => updateFormData({ ownerEmail: e.target.value })}
              placeholder="correo@ejemplo.com"
            />
            <MessageBox 
              message="Nunca enseñaremos esta información a nadie ni la guardamos en la base de datos" 
              position="bottom" 
              type="warning"
              className="lg:absolute lg:right-[-24px] lg:translate-x-full lg:bottom-0 lg:w-48"
            />
          </div>
        </div>
      </div>

      {/* Opinión sobre el propietario/agencia */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-black">Tu opinión sobre {formData.ownerType === 'Particular' ? 'el propietario' : 'la agencia'}</h3>
        <CustomTextarea
          id="ownerOpinion"
          value={formData.ownerOpinion || ''}
          onChange={(e) => updateFormData({ ownerOpinion: e.target.value })}
          placeholder={`Comparte tu experiencia con ${formData.ownerType === 'Particular' ? 'el propietario' : 'la agencia'}...`}
          rows={5}
        />
      </div>
      
      <div className="flex justify-between mt-4">
        <button 
          type="button" 
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
        >
          Anterior
        </button>
        <button 
          type="button" 
          onClick={onNext}
          className="bg-[rgb(74,94,50)] text-white py-2 px-6 rounded hover:bg-[rgb(60,76,40)]"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
};

export default Step5Owner;
