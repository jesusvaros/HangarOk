import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from '../store/useFormContext';
import { useAuth } from '../store/auth/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { FormDataType } from '../store/formTypes';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2RentalPeriod from './review-steps/Step2RentalPeriod';
import Step3PropertyCondition from './review-steps/Step3PropertyCondition';
import Step4Community from './review-steps/Step4Community';
import Step5Owner from './review-steps/Step5Owner';
import ContactModal from './ui/ContactModal';
import StepperBar from './ui/StepperBar';
import StaticFormMessagesContainer from './ui/StaticFormMessagesContainer';
import { getSessionIdBack, initializeSession } from '../services/sessionManager';
import { validateAndSubmitStep } from '../validation/formValidation';
import { showErrorToast } from './ui/toast/toastUtils';
import { getAddressStep1Data } from '../services/supabase/GetSubmitStep1';
import { getHangarStep2Data } from '../services/supabase/GetSubmitStep2';
import { getHangarStep3Data } from '../services/supabase/GetSubmitStep3';
import { getHangarStep4Data } from '../services/supabase/GetSubmitStep4';
import { getHangarStep5Data } from '../services/supabase/GetSubmitStep5';
import useMediaQuery from '../hooks/useMediaQuery';
import { notifyReviewCompleted } from '../services/telegram';
import { AnimatePresence, motion } from 'framer-motion';
import { trackUmamiEvent } from '../utils/analytics';

export interface SessionStatus {
  step1_completed?: boolean;
  step2_completed?: boolean;
  step3_completed?: boolean;
  step4_completed?: boolean;
  step5_completed?: boolean;
  created_at?: string;
}
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData,resetForm } = useFormContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Start with step 1 by default
  
  // Update URL when step changes
  const updateStep = (step: number, force: boolean = false) => {
    // Ensure step is valid before updating unless forcing (e.g., after successful submit)
    if (force || isStepAccessible(step)) {
      // Update state first
      setCurrentStep(step);
      
      // Then update URL with replace to prevent history entries
      setSearchParams({ step: step.toString() }, { replace: true });
    }
  };
  
  // Determine the highest accessible step based on completion status
  const getHighestAccessibleStep = () => {
    if (!sessionStatus) return 1;
    
    if (sessionStatus.step5_completed) return 5;
    if (sessionStatus.step4_completed) return 5;
    if (sessionStatus.step3_completed) return 4;
    if (sessionStatus.step2_completed) return 3;
    if (sessionStatus.step1_completed) return 2;
    return 1;
  };
  
  // Check if a step is accessible based on completion status
  const isStepAccessible = (step: number) => {
    const highestAccessible = getHighestAccessibleStep();
    return step <= highestAccessible;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  
  // Use the auth context
  const { user } = useAuth();

  const errorsDefault = {
    1: { fields: { hangarLocation: false, usesHangar: false, homeType: false, connectionType: false } },
    2: { fields: { belongsRating: false, fairUseRating: false, appearanceRating: false } },
    3: {
      fields: {
        daytimeSafetyRating: false,
        nighttimeSafetyRating: false,
        bikeMessedWith: false,
        currentBikeStorage: false,
        theftWorryRating: false,
      },
    },
    4: {
      fields: {
        lockEaseRating: false,
        spaceRating: false,
        lightingRating: false,
        maintenanceRating: false,
        stopsCycling: false,
      },
    },
    5: {
      fields: {
        reportEaseRating: false,
        fixSpeedRating: false,
        communicationRating: false,
        waitlistFairnessRating: false,
        checkboxReadTerms: false,
      },
    },
  };
  const [errors, setErrors] =
    useState<Record<number, { fields: Record<string, boolean> }>>(errorsDefault);

  // No-op mobile padding logic removed (it set the same padding for both cases)

  //fetch step 1 data
  const fetchStep1Data = useCallback(async () => {
    const hangarData = await getAddressStep1Data();

    if (hangarData) {
      updateFormData({
        hangarLocation: hangarData.hangar_location,
        usesHangar: hangarData.uses_hangar,
        homeType: hangarData.home_type,
        connectionType: hangarData.connection_type ?? undefined,
      });
    }
  }, [updateFormData]);

  //fetch step 2 data
  const fetchStep2Data = useCallback(async () => {
    const sessionId = await getSessionIdBack();
    if (!sessionId) return;
    
    const hangarData = await getHangarStep2Data(sessionId);

    if (hangarData) {
      updateFormData({
        belongsRating: hangarData.belongs_rating as 1|2|3|4|5,
        fairUseRating: hangarData.fair_use_rating as 1|2|3|4|5,
        appearanceRating: hangarData.appearance_rating as 1|2|3|4|5,
        perceptionTags: hangarData.tags,
        communityFeedback: hangarData.community_feedback || '',
      });
    }
  }, [updateFormData]);

  //fetch step 3 data
  const fetchStep3Data = useCallback(async () => {
    const sessionId = await getSessionIdBack();
    if (!sessionId) return;
    
    const hangarData = await getHangarStep3Data(sessionId);

    if (hangarData) {
      updateFormData({
        daytimeSafetyRating: hangarData.daytime_safety_rating as 1|2|3|4|5 | undefined,
        nighttimeSafetyRating: hangarData.nighttime_safety_rating as 1|2|3|4|5 | undefined,
        bikeMessedWith: hangarData.bike_messed_with ?? undefined,
        currentBikeStorage: hangarData.current_bike_storage as FormDataType['currentBikeStorage'],
        theftWorryRating: hangarData.theft_worry_rating as 1|2|3|4|5 | undefined,
        safetyTags: hangarData.safety_tags,
      });
    }
  }, [updateFormData]);

  //fetch step 4 data
  const fetchStep4Data = useCallback(async () => {
    const sessionId = await getSessionIdBack();
    if (!sessionId) return;
    
    const hangarData = await getHangarStep4Data(sessionId);

    if (hangarData) {
      updateFormData({
        lockEaseRating: hangarData.lock_ease_rating as 1|2|3|4|5 | undefined,
        spaceRating: hangarData.space_rating as 1|2|3|4|5 | undefined,
        lightingRating: hangarData.lighting_rating as 1|2|3|4|5 | undefined,
        maintenanceRating: hangarData.maintenance_rating as 1|2|3|4|5 | undefined,
        usabilityTags: hangarData.usability_tags,
        improvementSuggestion: hangarData.improvement_suggestion || '',
        stopsCycling: hangarData.stops_cycling as FormDataType['stopsCycling'],
        impactTags: hangarData.impact_tags,
      });
    }
  }, [updateFormData]);

  //fetch step 5 data
  const fetchStep5Data = useCallback(async () => {
    const sessionId = await getSessionIdBack();
    if (!sessionId) return;
    
    const hangarData = await getHangarStep5Data(sessionId);

    if (hangarData) {
      updateFormData({
        reportEaseRating: hangarData.report_ease_rating as 1|2|3|4|5 | undefined,
        fixSpeedRating: hangarData.fix_speed_rating as 1|2|3|4|5 | undefined,
        communicationRating: hangarData.communication_rating as 1|2|3|4|5 | undefined,
        maintenanceTags: hangarData.maintenance_tags,
        waitlistFairnessRating: hangarData.waitlist_fairness_rating as 1|2|3|4|5 | undefined,
        waitlistTags: hangarData.waitlist_tags,
        improvementFeedback: hangarData.improvement_feedback || '',
      });
    }
  }, [updateFormData]);

  // Sync currentStep from URL param and sessionStatus without refs/flags
  useEffect(() => {
    if (!sessionStatus) return;
    const requestedStep = parseInt(searchParams.get('step') || '1', 10);
    const validStep = Math.min(requestedStep, getHighestAccessibleStep());
    if (validStep !== currentStep) {
      setCurrentStep(validStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sessionStatus]);

  //session and fetch data - keep this separate from URL param handling
  useEffect(() => {
    const initSession = async () => {
      // Pass the user ID from auth context to the initializeSession function
      const { sessionStatus: sessionStatusResponse } = await initializeSession(user?.id);
      setSessionStatus(sessionStatusResponse);

      if (sessionStatusResponse?.step1_completed) {
        fetchStep1Data();
      }
      if (sessionStatusResponse?.step2_completed) {
        fetchStep2Data();
      }
      if (sessionStatusResponse?.step3_completed) {
        fetchStep3Data();
      }
      if (sessionStatusResponse?.step4_completed) {
        fetchStep4Data();
      }
      if (sessionStatusResponse?.step5_completed) {
        fetchStep5Data();
      }
      
      // Set initial step based on URL and session status
      const requestedStep = parseInt(searchParams.get('step') || '1', 10);
      
      // Get highest accessible step based on session status
      let highestAccessible = 1;
      if (sessionStatusResponse) {
        if (sessionStatusResponse.step5_completed) highestAccessible = 5;
        else if (sessionStatusResponse.step4_completed) highestAccessible = 5;
        else if (sessionStatusResponse.step3_completed) highestAccessible = 4;
        else if (sessionStatusResponse.step2_completed) highestAccessible = 3;
        else if (sessionStatusResponse.step1_completed) highestAccessible = 2;
      }
      
      const validStep = Math.min(requestedStep, highestAccessible);
      
      // Update step and URL if needed
      if (validStep !== currentStep) {
        setCurrentStep(validStep);
        setSearchParams({ step: validStep.toString() }, { replace: true });
      }
    };

    initSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStep1Data, fetchStep2Data, fetchStep3Data, fetchStep4Data, fetchStep5Data, user?.id]);

  const handleNext = async () => {
    // First check if we need to validate and submit the current step
    try {
      const result = await validateAndSubmitStep(currentStep, formData, {
        showToast: true,
        isSubmitting: setIsSubmitting,
      });
      
      // Update error state if needed
      if (result.fieldErrors) {
        setErrors(prev => ({
          ...prev,
          [currentStep]: {
            fields: result.fieldErrors || {},
          },
        }));
      }
      
      // Only proceed if validation is successful
      if (result.isValid) {
        // Optimistically mark current step as completed so Stepper UI and access checks stay in sync
        setSessionStatus(prev => ({
          ...(prev || {}),
          step1_completed: currentStep === 1 ? true : prev?.step1_completed,
          step2_completed: currentStep === 2 ? true : prev?.step2_completed,
          step3_completed: currentStep === 3 ? true : prev?.step3_completed,
          step4_completed: currentStep === 4 ? true : prev?.step4_completed,
          step5_completed: currentStep === 5 ? true : prev?.step5_completed,
        }));

        trackUmamiEvent('review:step-next', { step: currentStep });

        if (currentStep < 5) {
          updateStep(currentStep + 1, true);
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
          if (!user) {
            trackUmamiEvent('review:login-modal-open');
            setIsModalOpen(true);
          }else{
            const sessionId = await getSessionIdBack();
            if (sessionId) {
              onloginComplete(sessionId, user.id);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error validating step ${currentStep}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showErrorToast(errorMessage);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      trackUmamiEvent('review:step-prev', { from: currentStep, to: currentStep - 1 });
      updateStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const steps = ['Location', 'Community', 'Safety', 'Usability', 'Support'];
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const handleStepClick = async (step: number) => {
    if (step >= currentStep + 1) {
      setErrors(errorsDefault);
      try {
        const result = await validateAndSubmitStep(currentStep, formData, {
          showToast: true,
          isSubmitting: setIsSubmitting,
        });

        // Update error state for the current step
        if (result.fieldErrors) {
          setErrors(prev => ({
            ...prev,
            [currentStep]: {
              fields: result.fieldErrors || {},
            },
          }));
        }

        // Advance when validation succeeds
        if (result.isValid) {
          trackUmamiEvent('review:stepper-advance', { from: currentStep, to: step });
          if (step === 6) {
            trackUmamiEvent('review:login-modal-open');
            setIsModalOpen(true);
          } else {
            updateStep(step);
            window.scrollTo(0, 0);
          }
        }
      } catch (error) {
        console.error('Error validating step 1:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showErrorToast(errorMessage);
      }
    } else if (step <= currentStep) {
      trackUmamiEvent('review:stepper-back', { from: currentStep, to: step });
      updateStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Render the appropriate step component for a given step
  const renderStepFor = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return (
          <Step1ObjectiveData
            onNext={handleNext}
            fieldErrors={errors[1]?.fields}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <Step2RentalPeriod
            onNext={handleNext}
            onPrevious={handlePrevious}
            fieldErrors={errors[2]?.fields}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <Step3PropertyCondition
            onNext={handleNext}
            onPrevious={handlePrevious}
            fieldErrors={errors[3]?.fields}
            isSubmitting={isSubmitting}
          />
        );
      case 4:
        return (
          <Step4Community
            onNext={handleNext}
            onPrevious={handlePrevious}
            fieldErrors={errors[4]?.fields}
            isSubmitting={isSubmitting}
          />
        );
      case 5:
        return (
          <Step5Owner
            onNext={handleNext}
            onPrevious={handlePrevious}
            fieldErrors={errors[5]?.fields}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return <Step1ObjectiveData onNext={handleNext} />;
    }
  };
  // Backward compatible alias removed to avoid unused variable

  // No direction needed for vertical slide (bottom to top)

  const onloginComplete = (sessionId: string, userId: string) => {
    try {
      void notifyReviewCompleted(sessionId, userId, formData);
    } catch (e) {
      console.warn('Failed to trigger Telegram notification', e);
    }

    try {
      localStorage.removeItem('reviewSessionId');
      localStorage.removeItem('reviewSessionIdBack');
      localStorage.setItem(`reviewUserId:${sessionId}`, userId);
    } catch {
      // noop - storage may be unavailable
    }
    setIsModalOpen(false);
    navigate(`/review/${sessionId}`);
    trackUmamiEvent('review:submitted', { authenticated: true });
    resetForm();
    setCurrentStep(1);
    setErrors(errorsDefault);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full pt-[40px]  pb-0 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)] lg:min-h-[calc(100vh-120px)]">
      {/* Render only one layout based on viewport to avoid duplicate animations */}
      {!isDesktop ? (
        // Mobile / Tablet layout
        <div className="mb-6 w-full px-4">
          <StepperBar
            currentStep={currentStep}
            steps={steps}
            onStepClick={handleStepClick}
            orientation="horizontal"
            sessionStatus={sessionStatus}
          />
          {/* Container for form messages on mobile and tablet */}
          <div className="mt-50 mb-4">
            <StaticFormMessagesContainer step={currentStep} isMobile={true} />
          </div>
          {/* Form content for mobile: animate the whole box bottom -> top */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              className="rounded-lg bg-white p-7 md:p-8 shadow-md"
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -32, opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {renderStepFor(currentStep)}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        // Desktop layout - Three columns: Stepper | Form | Messages
        <div className="mx-auto max-w-[1300px] justify-center space-x-6 px-4 lg:flex">
          {/* Stepper - Left column */}
          <div className="flex-shrink-0 w-[200px]">
            <div className="sticky" style={{ top: '6rem' }}>
              <StepperBar
                currentStep={currentStep}
                steps={steps}
                onStepClick={handleStepClick}
                orientation="vertical"
                sessionStatus={sessionStatus}
              />
            </div>
          </div>

          {/* Form content - Center column - Fixed width (wider on laptop) */}
          <div className="flex-shrink-0 md:w-[500px] lg:w-[700px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                className="rounded-lg bg-white p-7 md:p-8 shadow-md"
                initial={{ y: 32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -32, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {renderStepFor(currentStep)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Space for message boxes - Right column - 24px gap */}
          <div className="flex-shrink-0 w-[200px] xl:w-[300px]">
            <div className="sticky" style={{ top: '6rem' }}>
            <StaticFormMessagesContainer step={currentStep} isMobile={false} />
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <ContactModal
          onClose={() => setIsModalOpen(false)}
          onLoginComplete={onloginComplete}
        />
      )}
    </div>
  );
};

export default AddReviewForm;
