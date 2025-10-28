import type { FormDataType } from '../store/formTypes';
import { submitHangarStep4 } from '../services/supabase/GetSubmitStep4';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep4 = (context: FormDataType): ValidationResult => {
  const { usesHangar, lockEaseRating, spaceRating, lightingRating, maintenanceRating, stopsCycling } = context;
  
  const fieldErrors = {
    lockEaseRating: false,
    spaceRating: false,
    lightingRating: false,
    maintenanceRating: false,
    stopsCycling: false,
  };

  // If user HAS a hangar, validate hangar-specific fields
  if (usesHangar === true) {
    if (!lockEaseRating) {
      return {
        isValid: false,
        message: 'Please rate how easy it is to lock and unlock',
        fieldErrors: { ...fieldErrors, lockEaseRating: true },
      };
    }

    if (!spaceRating) {
      return {
        isValid: false,
        message: 'Please rate the space to get your bike in and out',
        fieldErrors: { ...fieldErrors, spaceRating: true },
      };
    }

    if (!lightingRating) {
      return {
        isValid: false,
        message: 'Please rate the lighting',
        fieldErrors: { ...fieldErrors, lightingRating: true },
      };
    }

    if (!maintenanceRating) {
      return {
        isValid: false,
        message: 'Please rate how well it is looked after',
        fieldErrors: { ...fieldErrors, maintenanceRating: true },
      };
    }
  }
  // If user does NOT have a hangar, validate impact field
  else if (usesHangar === false) {
    if (!stopsCycling) {
      return {
        isValid: false,
        message: 'Please select if not having a hangar stops you from cycling',
        fieldErrors: { ...fieldErrors, stopsCycling: true },
      };
    }
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
      usesHangar,
      lockEaseRating,
      spaceRating,
      lightingRating,
      maintenanceRating,
      usabilityTags,
      improvementSuggestion,
      stopsCycling,
      impactTags,
    } = context;

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionIdBack');

    if (!sessionId) {
      console.error('No valid review session ID found');
      return { success: false, message: 'No valid session found' };
    }

    // Submit data using our Supabase client function
    const success = await submitHangarStep4({
      reviewSessionId: sessionId,
      lockEaseRating: usesHangar === true ? lockEaseRating : null,
      spaceRating: usesHangar === true ? spaceRating : null,
      lightingRating: usesHangar === true ? lightingRating : null,
      maintenanceRating: usesHangar === true ? maintenanceRating : null,
      usabilityTags: usesHangar === true ? (usabilityTags || []) : [],
      improvementSuggestion: usesHangar === true ? (improvementSuggestion || null) : null,
      stopsCycling: usesHangar === false ? stopsCycling : null,
      impactTags: usesHangar === false ? (impactTags || []) : [],
    });

    return {
      success,
      message: success ? null : 'Error saving data to database',
    };
  } catch (error) {
    console.error('Error submitting step 4 data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving data',
    };
  }
};
