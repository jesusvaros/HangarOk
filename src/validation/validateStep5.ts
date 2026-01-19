import type { FormDataType } from '../store/formTypes';
import { submitHangarStep5 } from '../services/supabase/GetSubmitStep5';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep5 = (context: FormDataType): ValidationResult => {
  const { usesHangar, reportEaseRating, fixSpeedRating, communicationRating, waitlistFairnessRating, checkboxReadTerms } = context;
  
  const fieldErrors = {
    reportEaseRating: false,
    fixSpeedRating: false,
    communicationRating: false,
    waitlistFairnessRating: false,
    checkboxReadTerms: false,
  };

  // If user HAS a hangar, validate hangar-specific fields
  if (usesHangar === true) {
    if (!reportEaseRating) {
      return {
        isValid: false,
        message: 'Please rate how easy it is to report a problem',
        fieldErrors: { ...fieldErrors, reportEaseRating: true },
      };
    }

    if (!fixSpeedRating) {
      return {
        isValid: false,
        message: 'Please rate how quickly they fix things',
        fieldErrors: { ...fieldErrors, fixSpeedRating: true },
      };
    }

    if (!communicationRating) {
      return {
        isValid: false,
        message: 'Please rate the communication',
        fieldErrors: { ...fieldErrors, communicationRating: true },
      };
    }
  }
  // If user does NOT have a hangar, validate waitlist field
  else if (usesHangar === false) {
    if (!waitlistFairnessRating) {
      return {
        isValid: false,
        message: 'Please rate how fair access to bike storage feels',
        fieldErrors: { ...fieldErrors, waitlistFairnessRating: true },
      };
    }
  }

  if (!checkboxReadTerms) {
    return {
      isValid: false,
      message: 'Please accept the terms and conditions',
      fieldErrors: { ...fieldErrors, checkboxReadTerms: true },
    };
  }

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
    const {
      usesHangar,
      reportEaseRating,
      fixSpeedRating,
      communicationRating,
      maintenanceTags,
      waitlistFairnessRating,
      waitlistTags,
      improvementFeedback,
    } = context;

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionIdBack');

    if (!sessionId) {
      console.error('No valid review session ID found');
      return { success: false, message: 'No valid session found' };
    }

    // Submit data using our Supabase client function
    const success = await submitHangarStep5({
      reviewSessionId: sessionId,
      reportEaseRating: usesHangar === true ? reportEaseRating : null,
      fixSpeedRating: usesHangar === true ? fixSpeedRating : null,
      communicationRating: usesHangar === true ? communicationRating : null,
      maintenanceTags: usesHangar === true ? (maintenanceTags || []) : [],
      waitlistFairnessRating: usesHangar === false ? waitlistFairnessRating : null,
      waitlistTags: usesHangar === false ? (waitlistTags || []) : [],
      improvementFeedback: improvementFeedback || null,
    });

    return {
      success,
      message: success ? null : 'Error saving data to database',
    };
  } catch (error) {
    console.error('Error submitting step 5 data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving data',
    };
  }
};
