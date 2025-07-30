import type { FormDataType } from '../store/formTypes';
import { submitSessionStep4 } from '../services/supabase/GetSubmitStep4';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep4 = (context: FormDataType): ValidationResult => {
  const { neighborTypes, communityEnvironment } = context;
  const fieldErrors = { neighborTypes: false, communityEnvironment: false };

  if (!neighborTypes || neighborTypes.length === 0) {
    return {
      isValid: false,
      message: 'No se ha proporcionado información de los vecinos',
      fieldErrors: { ...fieldErrors, neighborTypes: true },
    };
  }

  if (!communityEnvironment || communityEnvironment.length === 0) {
    return {
      isValid: false,
      message: 'No se ha proporcionado información del ambiente del barrio',
      fieldErrors: { ...fieldErrors, communityEnvironment: true },
    };
  }

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep4 = async (
  context: FormDataType
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const {
      neighborTypes,
      communityEnvironment,
      touristApartments,
      buildingCleanliness,
      communitySecurity,
      communityOpinion,
    } = context;

    // Basic check - validation should have already happened
    if (!neighborTypes || !communityEnvironment) {
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
    const success = await submitSessionStep4({
      neighborTypes,
      communityEnvironment,
      touristApartments,
      buildingCleanliness,
      communitySecurity,
      communityOpinion,
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
