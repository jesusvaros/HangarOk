import type { FormDataType } from '../store/formTypes';
import { submitAddressStep1 } from '../services/supabase';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export interface FormContext {
  addressDetails?: FormDataType['addressDetails'];
}

export const validateStep1 = (context: FormContext): ValidationResult => {
  const { addressDetails } = context;
  const fieldErrors = { street: false, number: false };

  if (!addressDetails) {
    return {
      isValid: false,
      message: 'No se ha proporcionado información de dirección',
      fieldErrors,
    };
  }

  if (!addressDetails.street || !addressDetails.street.trim()) {
    return {
      isValid: false,
      message: 'La dirección es obligatoria',
      fieldErrors: { ...fieldErrors, street: true },
    };
  }

  if (
    !addressDetails.number &&
    (!addressDetails.components?.house_number || addressDetails.components.house_number === '')
  ) {
    return {
      isValid: false,
      message: 'El número de la dirección es obligatorio',
      fieldErrors: { ...fieldErrors, number: true },
    };
  }
  if (addressDetails.components?.house_number !== addressDetails.number) {
    return {
      isValid: false,
      message: 'Revisa el número de la dirección',
      fieldErrors: { ...fieldErrors, number: true },
    };
  }

  // Validate coordinates
  if (
    !addressDetails.coordinates ||
    !addressDetails.coordinates.lat ||
    !addressDetails.coordinates.lng
  ) {
    return {
      isValid: false,
      message: 'No se han podido obtener las coordenadas de la dirección',
      fieldErrors: { ...fieldErrors, street: true },
    };
  }

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep1 = async (
  context: FormContext
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const { addressDetails } = context;

    // Basic check - validation should have already happened
    if (!addressDetails?.coordinates) {
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
    const success = await submitAddressStep1({
      addressDetails,
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
