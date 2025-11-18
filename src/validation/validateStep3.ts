import type { FormDataType } from '../store/formTypes';
import { submitHangarStep3 } from '../services/supabase/GetSubmitStep3';

export interface ValidationResult {
  isValid: boolean;
  message: string | null;
  fieldErrors?: {
    [key: string]: boolean;
  };
}

export const validateStep3 = (context: FormDataType): ValidationResult => {
  const { usesHangar, daytimeSafetyRating, nighttimeSafetyRating, bikeMessedWith, currentBikeStorage, theftWorryRating } = context;
  
  const fieldErrors = {
    daytimeSafetyRating: false,
    nighttimeSafetyRating: false,
    bikeMessedWith: false,
    currentBikeStorage: false,
    theftWorryRating: false,
  };

  // If user HAS a hangar, validate hangar-specific fields
  if (usesHangar === true) {
    if (!daytimeSafetyRating) {
      return {
        isValid: false,
        message: 'Please rate daytime safety',
        fieldErrors: { ...fieldErrors, daytimeSafetyRating: true },
      };
    }

    if (!nighttimeSafetyRating) {
      return {
        isValid: false,
        message: 'Please rate nighttime safety',
        fieldErrors: { ...fieldErrors, nighttimeSafetyRating: true },
      };
    }

    if (bikeMessedWith === undefined) {
      return {
        isValid: false,
        message: 'Please indicate if you or someone nearby had a theft or attempted theft here',
        fieldErrors: { ...fieldErrors, bikeMessedWith: true },
      };
    }
  }
  // If user does NOT have a hangar, validate non-hangar fields
  else if (usesHangar === false) {
    if (!currentBikeStorage) {
      return {
        isValid: false,
        message: 'Please select where you keep your bike',
        fieldErrors: { ...fieldErrors, currentBikeStorage: true },
      };
    }

    if (!theftWorryRating) {
      return {
        isValid: false,
        message: 'Please rate how worried you are about theft',
        fieldErrors: { ...fieldErrors, theftWorryRating: true },
      };
    }
  }

  return {
    isValid: true,
    message: null,
    fieldErrors,
  };
};

export const submitStep3 = async (
  context: FormDataType
): Promise<{ success: boolean; message: string | null }> => {
  try {
    const {
      usesHangar,
      daytimeSafetyRating,
      nighttimeSafetyRating,
      bikeMessedWith,
      currentBikeStorage,
      theftWorryRating,
      safetyTags,
    } = context;

    // Get the reviewSessionId from localStorage
    const sessionId = localStorage.getItem('reviewSessionIdBack');

    if (!sessionId) {
      console.error('No valid review session ID found');
      return { success: false, message: 'No valid session found' };
    }

    // Submit data using our Supabase client function
    const success = await submitHangarStep3({
      reviewSessionId: sessionId,
      daytimeSafetyRating: usesHangar === true ? daytimeSafetyRating : null,
      nighttimeSafetyRating: usesHangar === true ? nighttimeSafetyRating : null,
      bikeMessedWith: usesHangar === true ? bikeMessedWith : null,
      currentBikeStorage: usesHangar === false ? currentBikeStorage : null,
      theftWorryRating: usesHangar === false ? theftWorryRating : null,
      safetyTags: safetyTags || [],
      photoUrl: null,
    });

    return {
      success,
      message: success ? null : 'Error saving data to database',
    };
  } catch (error) {
    console.error('Error submitting step 3 data:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error saving data',
    };
  }
};
