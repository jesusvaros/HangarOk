/**
 * Centralized form validation system for the entire application
 * This file provides validation functions for all form steps
 */

import type { AddressResult } from '../components/ui/AddressAutocomplete';
import { showErrorToast } from '../components/ui/toast/toastUtils';
import { submitAddressStep1 } from '../services/supabase';

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
  const fieldErrors = { street: false, number: false };
  
  // Check if we have address details
  if (!addressDetails) {
    return {
      isValid: false,
      message: 'No se ha proporcionado información de dirección',
      fieldErrors
    };
  }
  
  // Validate required street field
  if (!addressDetails.street || !addressDetails.street.trim()) {
    return {
      isValid: false,
      message: 'La dirección es obligatoria',
      fieldErrors: { ...fieldErrors, street: true }
    };
  }
  
  // Validate required number field - check both direct number and components
  if (!addressDetails.number && (!addressDetails.components?.house_number || addressDetails.components.house_number === '')) {
    return {
      isValid: false,
      message: 'El número de la dirección es obligatorio',
      fieldErrors: { ...fieldErrors, number: true }
    };
  }
  
  // Validate coordinates
  if (!addressDetails.coordinates || !addressDetails.coordinates.lat || !addressDetails.coordinates.lng) {
    return {
      isValid: false,
      message: 'No se han podido obtener las coordenadas de la dirección',
      fieldErrors: { ...fieldErrors, street: true }
    };
  }
  
  // All checks passed
  return {
    isValid: true,
    message: null,
    fieldErrors
  };
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
    
    // Basic check - validation should have already happened
    if (!addressDetails?.coordinates) {
      return { success: false, message: 'Datos de dirección incompletos' };
    }

    // Get the token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { success: false, message: 'No se ha encontrado el token de autenticación' };
    }
    
    // Submit data using our Supabase client function with simplified payload
    const success = await submitAddressStep1({
      address: addressResult || null,
      addressDetails
    }, token);
    
    return { 
      success, 
      message: success ? null : 'Error al guardar los datos en la base de datos' 
    };
  } catch (error) {
    console.error('Error submitting address data:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al guardar los datos'
    };
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
  
  // Set submitting state if provided
  if (isSubmitting) isSubmitting(true);
  
  try {
    // 1. Validate the step
    const validationResult = validateStep(step, context);
    if (!validationResult.isValid) {
      // Show toast on validation failure if enabled
      if (showToast && validationResult.message) {
        showErrorToast(validationResult.message);
      }
      return { ...validationResult, isSubmitted: false };
    }
    
    // 2. Submit data if validation passes
    let submissionResult;
    
    // Choose submission handler based on step
    switch (step) {
      case 1:
        submissionResult = await submitStep1(context);
        break;
      // Add more cases as needed
      default:
        submissionResult = { success: true, message: null };
    }
    
    // 3. Handle submission result
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
    
    // 4. Return success result
    return { isValid: true, isSubmitted: true, message: null };
  } catch (error) {
    // 5. Handle any exceptions
    console.error(`Error in step ${step}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    if (showToast) showErrorToast(errorMessage);
    
    return { 
      isValid: false, 
      isSubmitted: false, 
      message: errorMessage,
      fieldErrors: {} 
    };
  } finally {
    // 6. Always reset submitting state
    if (isSubmitting) isSubmitting(false);
  }
};
