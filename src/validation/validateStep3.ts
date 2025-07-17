import type { FormDataType } from '../store/formTypes';
import { submitSessionStep3 } from '../services/supabase/GetSubmitStep3';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}


export const validateStep3 = (context: FormDataType): ValidationResult => {
  const { summerTemperature, winterTemperature, noiseLevel, lightLevel, maintenanceStatus } = context;
  const fieldErrors = { summerTemperature: false, winterTemperature: false, noiseLevel: false, lightLevel: false, maintenanceStatus: false };

  if (!summerTemperature) {
    return {
      isValid: false,
      message: 'La temperatura en verano es obligatoria',
      fieldErrors: { ...fieldErrors, summerTemperature: true },
    };
  }

  if (!winterTemperature) {
    return {
      isValid: false,
      message: 'La temperatura en invierno es obligatoria',
      fieldErrors: { ...fieldErrors, winterTemperature: true },
    };
  }

  if (
    !noiseLevel
  ) {
    return {
      isValid: false,
      message: 'El nivel de ruido es obligatorio',
      fieldErrors: { ...fieldErrors, noiseLevel: true },
    };
  }
  if (!lightLevel) {
    return {
      isValid: false,
      message: 'El nivel de luz es obligatorio',
      fieldErrors: { ...fieldErrors, lightLevel: true },
    };
  }

  // Validate coordinates
  if (
    !maintenanceStatus
  ) {
    return {
      isValid: false,
      message: 'El estado de mantenimiento es obligatorio',
      fieldErrors: { ...fieldErrors, street: true },
    };
  }

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep3 = async (
  context: FormDataType
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const { summerTemperature, winterTemperature, noiseLevel, lightLevel, maintenanceStatus, propertyOpinion } = context;

    // Basic check - validation should have already happened
    if (!summerTemperature || !winterTemperature || !noiseLevel || !lightLevel || !maintenanceStatus) {
      return { success: false, message: 'Datos incompletos' };
    }

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionId');

    // If no sessionId exists, we can't proceed with submission
    if (!sessionId || sessionId === 'PENDING') {
      console.error('No valid review session ID found');
      return { success: false, message: 'No se ha encontrado una sesión válida' };
    }

    // Submit data using our Supabase client function with simplified payload
    const success = await submitSessionStep3({
      summerTemperature,
      winterTemperature,
      noiseLevel,
      lightLevel,
      maintenanceStatus,
      propertyOpinion,
    });

    return {
      success,
      message: success ? null : 'Error al guardar los datos en la base de datos',
    };
  } catch (error) {
    console.error('Error submitting address data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al guardar los datos',
    };
  }
};
