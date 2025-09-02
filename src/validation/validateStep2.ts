import type { FormDataType } from '../store/formTypes';
import { submitSessionStep2 } from '../services/supabase/GetSubmitStep2';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep2 = (context: FormDataType): ValidationResult => {
  const { startYear, endYear, price, wouldRecommend , depositReturned} = context;
  const fieldErrors = { startYear: false, monthlyPrice: false, wouldRecommend: false };

  if (!startYear) {
    return {
      isValid: false,
      message: 'El año de inicio es obligatorio',
      fieldErrors: { ...fieldErrors, startYear: true },
    };
  }

  if (!price) {
    return {
      isValid: false,
      message: 'El precio es obligatorio',
      fieldErrors: { ...fieldErrors, monthlyPrice: true },
    };
  }

  if (endYear && startYear > endYear) {
    return {
      isValid: false,
      message: 'El año de fin debe ser antes del año de inicio',
      fieldErrors: { ...fieldErrors, endYear: true, startYear: true },
    };
  }
  if(!wouldRecommend){
    return {
      isValid: false,
      message: 'La recomendación es obligatoria',
      fieldErrors: { ...fieldErrors, wouldRecommend: true },
    };
  }
  console.log(depositReturned);
  console.log(endYear);
  if(!depositReturned && endYear){
    return {
      isValid: false,
      message: 'Si marcas que no vives en el piso, debes indicar si la fianza fue devuelta',
      fieldErrors: { ...fieldErrors, depositReturned: true },
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
    const { startYear, endYear, price, includedServices, wouldRecommend, depositReturned } = context;

    // Basic check - validation should have already happened
    if (!startYear || !price || !includedServices || !wouldRecommend) {
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
      wouldRecommend: wouldRecommend || '', 
      depositReturned: depositReturned || undefined,
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
