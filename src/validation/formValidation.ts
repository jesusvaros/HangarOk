/**
 * Centralized form validation system for the entire application
 * This file provides validation functions for all form steps
 */

import type { AddressResult } from '../components/ui/AddressAutocomplete';
import { showErrorToast } from '../components/ui/toast/toastUtils';
import { submitAddressStep1, type AddressStep1Payload } from '../services/supabase';

/**
 * Address details interface used in Step 1
 */
export interface AddressDetails {
  street?: string;
  number?: string;
  floor?: string;
  door?: string;
  city?: string;
  postalCode?: string;
  state?: string;
  fullAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  components?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    state?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Result of step validation
 */
export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

/**
 * Form context interface containing all form data
 */
export interface FormContext {
  // Step 1 data
  addressDetails?: AddressDetails;
  addressResult?: AddressResult;
  // Add more steps as they are implemented
}

/**
 * Validates Step 1 (Address) data
 * 
 * @param context Form context containing all form data
 * @returns ValidationResult with validation status and error information
 */
export const validateStep1 = (context: FormContext): ValidationResult => {
  const { addressDetails } = context;
  const result: ValidationResult = {
    isValid: true,
    message: null,
    fieldErrors: {
      street: false,
      number: false
    }
  };

  // Check if address details exist
  if (!addressDetails) {
    result.isValid = false;
    result.message = 'No se ha proporcionado información de dirección';
    return result;
  }

  // Validate required street field
  if (!addressDetails.street || !addressDetails.street.trim()) {
    result.isValid = false;
    result.message = 'La dirección es obligatoria';
    if (result.fieldErrors) result.fieldErrors.street = true;
    return result;
  }

  // Validate required number field
  if (!addressDetails.number && (!addressDetails.components?.house_number || addressDetails.components.house_number === '')) {
    result.isValid = false;
    result.message = 'El número de la dirección es obligatorio';
    if (result.fieldErrors) result.fieldErrors.number = true;
    return result;
  }

  // Validate coordinates
  if (!addressDetails.coordinates || !addressDetails.coordinates.lat || !addressDetails.coordinates.lng) {
    result.isValid = false;
    result.message = 'No se han podido obtener las coordenadas de la dirección';
    if (result.fieldErrors) result.fieldErrors.street = true;
    return result;
  }

  return result;
};

/**
 * Submits Step 1 data to the server
 * 
 * @param context Form context containing all form data
 * @returns Promise with submission result
 */
export const submitStep1 = async (context: FormContext): Promise<{ success: boolean; message: string | null }> => {
  try {
    const { addressDetails, addressResult } = context;
    
    if (!addressDetails || !addressResult) {
      return { success: false, message: 'Datos de dirección incompletos' };
    }

    // Get the token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { success: false, message: 'No se ha encontrado el token de autenticación' };
    }
    
    // Prepare data for submission
    const addressData: AddressStep1Payload = {
      address: addressResult,
      addressDetails: addressDetails,
    };
    
    // Submit data using our Supabase client function
    const success = await submitAddressStep1(addressData, token);
    
    if (!success) {
      return { success: false, message: 'Error al guardar los datos en la base de datos' };
    }
    
    return { success: true, message: null };
  } catch (error) {
    console.error('Error submitting address data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al guardar los datos';
    return { success: false, message: errorMessage };
  }
};

/**
 * Validates any form step
 * 
 * @param step Step number to validate
 * @param context Form context containing all form data
 * @returns ValidationResult with validation status and error information
 */
export const validateStep = (step: number, context: FormContext): ValidationResult => {
  switch (step) {
    case 1:
      return validateStep1(context);
    // Add more cases as more steps are implemented
    default:
      // For steps without validation, return valid
      return { isValid: true, message: null };
  }
};

/**
 * Validates and submits a step
 * 
 * @param step Step number to validate and submit
 * @param context Form context containing all form data
 * @param options Options for validation and submission
 * @returns Promise with validation and submission result
 */
export const validateAndSubmitStep = async (
  step: number, 
  context: FormContext,
  options: { 
    showToast?: boolean,
    isSubmitting?: (submitting: boolean) => void
  } = {}
): Promise<{ 
  isValid: boolean; 
  isSubmitted: boolean; 
  message: string | null;
  fieldErrors?: { [key: string]: boolean } 
}> => {
  const { showToast = true, isSubmitting } = options;
  
  // Set submitting state to true if provided
  if (isSubmitting) isSubmitting(true);
  
  try {
    // Validate the step first
    const validationResult = validateStep(step, context);
    
    // If validation fails, show toast and return result
    if (!validationResult.isValid) {
      if (showToast && validationResult.message) {
        showErrorToast(validationResult.message);
      }
      return { 
        ...validationResult, 
        isSubmitted: false 
      };
    }
    
    // If validation passes, submit the step data
    let submissionResult = { success: true, message: null as string | null };
    
    switch (step) {
      case 1:
        submissionResult = await submitStep1(context);
        break;
      // Add more cases as more steps are implemented
    }
    
    // If submission fails, show toast and return result
    if (!submissionResult.success) {
      if (showToast && submissionResult.message) {
        showErrorToast(submissionResult.message);
      }
      return { 
        isValid: false, 
        isSubmitted: false, 
        message: submissionResult.message || 'Error en el envío de datos',
        fieldErrors: {} 
      };
    }
    
    // If all succeeds, return success result
    return { 
      isValid: true, 
      isSubmitted: true, 
      message: null 
    };
  } catch (error) {
    console.error(`Error validating and submitting step ${step}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    if (showToast) {
      showErrorToast(errorMessage);
    }
    
    return { 
      isValid: false, 
      isSubmitted: false, 
      message: errorMessage,
      fieldErrors: {} 
    };
  } finally {
    // Reset submitting state if provided
    if (isSubmitting) isSubmitting(false);
  }
};
