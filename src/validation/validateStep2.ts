import type { FormDataType } from '../store/formTypes';
import { submitHangarStep2 } from '../services/supabase/GetSubmitStep2';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep2 = (context: FormDataType): ValidationResult => {
  const { belongsRating, fairUseRating, appearanceRating } = context;
  const fieldErrors = { 
    belongsRating: false, 
    fairUseRating: false, 
    appearanceRating: false 
  };

  if (!belongsRating) {
    return {
      isValid: false,
      message: 'Please rate how well this hangar belongs here',
      fieldErrors: { ...fieldErrors, belongsRating: true },
    };
  }

  if (!fairUseRating) {
    return {
      isValid: false,
      message: 'Please rate if it\'s a fair use of space',
      fieldErrors: { ...fieldErrors, fairUseRating: true },
    };
  }

  if (!appearanceRating) {
    return {
      isValid: false,
      message: 'Please rate how it looks on your street',
      fieldErrors: { ...fieldErrors, appearanceRating: true },
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
    const { belongsRating, fairUseRating, appearanceRating, perceptionTags, communityFeedback } = context;

    // Basic check - validation should have already happened
    if (!belongsRating || !fairUseRating || !appearanceRating) {
      return { success: false, message: 'Incomplete data' };
    }

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionIdBack');

    // If no sessionId exists, we can't proceed with submission
    if (!sessionId) {
      console.error('No valid review session ID found');
      return { success: false, message: 'No valid session found' };
    }

    // Submit data using our Supabase client function
    const success = await submitHangarStep2({
      reviewSessionId: sessionId,
      belongsRating,
      fairUseRating,
      appearanceRating,
      tags: perceptionTags || [],
      communityFeedback: communityFeedback || null,
    });

    return {
      success,
      message: success ? null : 'Error saving data to database',
    };
  } catch (error) {
    console.error('Error submitting step 2 data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving data',
    };
  }
};
