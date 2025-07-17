import type { FormDataType } from '../store/formTypes';
import {  submitSessionStep2 } from '../services/supabase/GetSubmitStep2';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep2 = (context: FormDataType): ValidationResult => {
  const { startYear, endYear, price } = context;
  const fieldErrors = { startYear: false, price: false };

  if (!startYear) {
    return {
      isValid: false,
      message: 'El año de inicio es obligatorio',
      fieldErrors:{...fieldErrors, startYear: true},
    };
  }

  if (!price) {
    return {
      isValid: false,
      message: 'El precio es obligatorio',
      fieldErrors: { ...fieldErrors, price: true },
    };
  }

  if(endYear && startYear > endYear) {
    return {
      isValid: false,
      message: 'El año de fin debe ser antes del año de inicio',
      fieldErrors: { ...fieldErrors, endYear: true, startYear: true },
    };
  }

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep2 = async (
  context: FormDataType
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const { startYear, endYear, price, includedServices } = context;

    console.log('submitStep2', context)

    // Basic check - validation should have already happened
    if (!startYear || !price) {
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
    const success = await submitSessionStep2({
      startYear,
      endYear: endYear == undefined ? null : endYear,
      price,
      includedServices: includedServices || [],
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
