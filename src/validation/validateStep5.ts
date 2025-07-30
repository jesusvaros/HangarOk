import type { FormDataType } from '../store/formTypes';
import { submitSessionStep5 } from '../services/supabase/GetSubmitStep5';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}


export const validateStep5 = (context: FormDataType): ValidationResult => {
  const { ownerType, checkboxReadTerms } = context;
  const fieldErrors = { ownerType: false, checkboxReadTerms: false };

  if (!ownerType) {
    return {
      isValid: false,
      message: 'No se ha proporcionado información de dirección',
      fieldErrors,
    };
  }

  if (!checkboxReadTerms) {
    return {
      isValid: false,
      message: 'Acepta los términos y condiciones',
      fieldErrors:{...fieldErrors, checkboxReadTerms: true},
    };
  }

  // ai to check the text??

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep5 = async (
  context: FormDataType
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const { ownerType, ownerName, ownerPhone, ownerEmail, ownerOpinion ,ownerNameHash, ownerPhoneHash, ownerEmailHash} = context;

    // Basic check - validation should have already happened
    if (!ownerType) {
      return { success: false, message: 'Datos de dirección incompletos' };
    }

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionId');

    // If no sessionId exists, we can't proceed with submission
    if (!sessionId || sessionId === 'PENDING') {
      console.error('No valid review session ID found');
      return { success: false, message: 'No se ha encontrado una sesión válida' };
    }

    // Submit data using our Supabase client function with simplified payload
    const success = await submitSessionStep5({
      ownerType,
      ownerName,
      ownerPhone,
      ownerEmail,
      ownerOpinion,
      ownerNameHash,
      ownerPhoneHash,
      ownerEmailHash,
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
