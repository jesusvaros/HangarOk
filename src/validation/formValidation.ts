import { showErrorToast } from '../components/ui/toast/toastUtils';
import type { FormDataType } from '../store/formTypes';
import { submitStep1, validateStep1 } from './validateStep1';
import { submitStep2, validateStep2 } from './validateStep2';
import { submitStep3, validateStep3 } from './validateStep3';
import { submitStep4, validateStep4 } from './validateStep4';

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

export interface FormContext {
  addressDetails?: FormDataType['addressDetails'];
}

export const validateStep = (step: number, context: FormContext): ValidationResult => {
  console.log('validateStep', step, context);
  switch (step) {
    case 1:
      return validateStep1(context);
    case 2:
      return validateStep2(context);
    case 3:
      return validateStep3(context);
    case 4:
      return validateStep4(context);
    // case 5:
    //   return validateStep5(context);
    default:
      return { isValid: true, message: null };
  }
};

export const submitStep = (step: number, context: FormContext): Promise<{ success: boolean; message: string | null }> => {
  console.log('submitStep', step, context);
  switch (step) {
    case 1:
      return submitStep1(context);
    case 2:
      return submitStep2(context);
    case 3:
      return submitStep3(context);
    case 4:
      return submitStep4(context);
    // case 5:
    //   return submitStep5(context);
    default:
      return Promise.resolve({ success: true, message: null });
  }
};

export const validateAndSubmitStep = async (
  step: number,
  context: FormContext,
  options: {
    showToast?: boolean;
    isSubmitting?: (submitting: boolean) => void;
  } = {}
): Promise<{
  isValid: boolean;
  isSubmitted: boolean;
  message: string | null;
  fieldErrors?: { [key: string]: boolean };
}> => {
  const { showToast = true, isSubmitting } = options;
  if (isSubmitting) isSubmitting(true);

  try {
    const validationResult = validateStep(step, context);
    if (!validationResult.isValid) {
      if (showToast && validationResult.message) {
        showErrorToast(validationResult.message);
      }
      return { ...validationResult, isSubmitted: false };
    }

    const submissionResult = await submitStep(step, context);

    // 3. Handle submission result
    if (!submissionResult.success) {
      if (showToast && submissionResult.message) {
        showErrorToast(submissionResult.message);
      }
      return {
        isValid: false,
        isSubmitted: false,
        message: submissionResult.message || 'Error en el envío de datos',
        fieldErrors: {},
      };
    }

    // 4. Return success result
    return { isValid: true, isSubmitted: true, message: null };
  } catch (error) {
    console.error(`Error in step ${step}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

    if (showToast) showErrorToast(errorMessage);

    return {
      isValid: false,
      isSubmitted: false,
      message: errorMessage,
      fieldErrors: {},
    };
  } finally {
    // 6. Always reset submitting state
    if (isSubmitting) isSubmitting(false);
  }
};
