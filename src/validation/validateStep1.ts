import type { FormDataType } from '../store/formTypes';
import { submitAddressStep1 } from '../services/supabase/GetSubmitStep1';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export interface FormContext {
  hangarLocation?: FormDataType['hangarLocation'];
  hangarNumber?: FormDataType['hangarNumber'];
  usesHangar?: FormDataType['usesHangar'];
  openToSwap?: FormDataType['openToSwap'];
  homeType?: FormDataType['homeType'];
  connectionType?: FormDataType['connectionType'];
}

export const validateStep1 = (context: FormContext): ValidationResult => {
  const { hangarLocation, usesHangar, homeType, connectionType } = context;
  const fieldErrors = { 
    hangarLocation: false, 
    usesHangar: false, 
    homeType: false, 
    connectionType: false 
  };

  // Validate hangar location
  if (!hangarLocation) {
    return {
      isValid: false,
      message: 'Please provide the hangar location',
      fieldErrors: { ...fieldErrors, hangarLocation: true },
    };
  }

  if (!hangarLocation.street || !hangarLocation.street.trim()) {
    return {
      isValid: false,
      message: 'The hangar street address is required',
      fieldErrors: { ...fieldErrors, hangarLocation: true },
    };
  }

  if (!hangarLocation.coordinates || !hangarLocation.coordinates.lat || !hangarLocation.coordinates.lng) {
    return {
      isValid: false,
      message: 'Could not get coordinates for the hangar location',
      fieldErrors: { ...fieldErrors, hangarLocation: true },
    };
  }

  // Validate uses hangar selection
  if (usesHangar === undefined) {
    return {
      isValid: false,
      message: 'Please select whether you use this hangar',
      fieldErrors: { ...fieldErrors, usesHangar: true },
    };
  }

  // Validate home type
  if (!homeType) {
    return {
      isValid: false,
      message: 'Please select your home type',
      fieldErrors: { ...fieldErrors, homeType: true },
    };
  }

  // Validate connection type for riders with a space
  if (usesHangar === true && !connectionType) {
    return {
      isValid: false,
      message: 'Please select how you use this hangar',
      fieldErrors: { ...fieldErrors, connectionType: true },
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
    const { hangarLocation, hangarNumber, usesHangar, openToSwap, homeType, connectionType } = context;

    // Basic check - validation should have already happened
    if (!hangarLocation?.coordinates || usesHangar === undefined || !homeType || !connectionType) {
      return { success: false, message: 'Incomplete hangar data' };
    }

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionId');

    // If no sessionId exists, we can't proceed with submission
    if (!sessionId || sessionId === 'PENDING') {
      console.error('No valid review session ID found');
      return { success: false, message: 'No valid session found' };
    }

    // Submit data using our Supabase client function
    const success = await submitAddressStep1({
      hangarLocation,
      hangarNumber,
      usesHangar,
      openToSwap,
      homeType,
      connectionType,
    });

    return {
      success,
      message: success ? null : 'Error saving data to database',
    };
  } catch (error) {
    console.error('Error submitting hangar step 1 data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving data',
    };
  }
};
