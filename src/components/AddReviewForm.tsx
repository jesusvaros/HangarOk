import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from '../store/useFormContext';
import { useAuth } from '../store/auth/hooks';
import { useSearchParams } from 'react-router-dom';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2RentalPeriod from './review-steps/Step2RentalPeriod';
import Step3PropertyCondition from './review-steps/Step3PropertyCondition';
import Step4Community from './review-steps/Step4Community';
import Step5Owner from './review-steps/Step5Owner';
import ContactModal from './ui/ContactModal';
import StepperBar from './ui/StepperBar';
import StaticFormMessagesContainer from './ui/StaticFormMessagesContainer';
import { initializeSession } from '../services/sessionManager';
import { validateAndSubmitStep } from '../validation/formValidation';
import { showErrorToast } from './ui/toast/toastUtils';
import { getAddressStep1Data } from '../services/supabase/GetSubmitStep1';
import { getSessionStep2Data } from '../services/supabase/GetSubmitStep2';
import { getSessionStep3Data } from '../services/supabase/GetSubmitStep3';
import { getSessionStep4Data } from '../services/supabase/GetSubmitStep4';
import { getSessionStep5Data } from '../services/supabase/GetSubmitStep5';

export interface SessionStatus {
  step1_completed?: boolean;
  step2_completed?: boolean;
  step3_completed?: boolean;
  step4_completed?: boolean;
  step5_completed?: boolean;
  created_at?: string;
}
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [searchParams, setSearchParams] = useSearchParams();
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
    1: { fields: { street: false, number: false } },
    2: { fields: { startDate: false, endDate: false, montlyPrice: false } },
    3: {
      fields: {
        summerTemperature: false,
        winterTemperature: false,
        noiseLevel: false,
        lightLevel: false,
        maintenanceStatus: false,
      },
    },
    4: { fields: { neighborTypes: false, communityEnvironment: false } },
    5: { fields: { owner: false } },
  };
  const [errors, setErrors] =
    useState<Record<number, { fields: Record<string, boolean> }>>(errorsDefault);

  // No-op mobile padding logic removed (it set the same padding for both cases)

  //fetch step 1 data
  const fetchStep1Data = useCallback(async () => {
    const addressData = await getAddressStep1Data();

    if (addressData) {
      updateFormData({
        addressDetails: addressData.address_details,
      });
    }
  }, [updateFormData]);

  //fetch step 2 data
  const fetchStep2Data = useCallback(async () => {
    const estanciaData = await getSessionStep2Data();

    if (estanciaData) {
      updateFormData({
        startYear: estanciaData.start_year,
        endYear: estanciaData.end_year,
        price: estanciaData.price,
        includedServices: estanciaData.included_services,
      });
    }
  }, [updateFormData]);

  //fetch step 3 data
  const fetchStep3Data = useCallback(async () => {
    const pisoData = await getSessionStep3Data();

    if (pisoData) {
      updateFormData({
        summerTemperature: pisoData.summer_temperature,
        winterTemperature: pisoData.winter_temperature,
        noiseLevel: pisoData.noise_level,
        lightLevel: pisoData.light_level,
        maintenanceStatus: pisoData.maintenance_status,
        propertyOpinion: pisoData.property_opinion,
      });
    }
  }, [updateFormData]);

  //fetch step 4 data
  const fetchStep4Data = useCallback(async () => {
    const comunidadData = await getSessionStep4Data();

    if (comunidadData) {
      updateFormData({
        neighborTypes: comunidadData.neighbor_types,
        communityEnvironment: comunidadData.community_environment,
        touristApartments: comunidadData.tourist_apartments,
        buildingCleanliness: comunidadData.building_cleanliness,
        communitySecurity: comunidadData.community_security,
        communityOpinion: comunidadData.community_opinion,
      });
    }
  }, [updateFormData]);

  //fetch step 5 data
  const fetchStep5Data = useCallback(async () => {
    const gestionData = await getSessionStep5Data();

    if (gestionData) {
      updateFormData({
        ownerType: gestionData.owner_type,
        ownerNameHash: gestionData.owner_name_hash,
        ownerPhoneHash: gestionData.owner_phone_hash,
        ownerEmailHash: gestionData.owner_email_hash,
        ownerOpinion: gestionData.owner_opinion,
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
      if (result.isValid && currentStep < 5) {
        // Optimistically mark current step as completed so Stepper UI and access checks stay in sync
        setSessionStatus(prev => ({
          ...(prev || {}),
          step1_completed: currentStep === 1 ? true : prev?.step1_completed,
          step2_completed: currentStep === 2 ? true : prev?.step2_completed,
          step3_completed: currentStep === 3 ? true : prev?.step3_completed,
          step4_completed: currentStep === 4 ? true : prev?.step4_completed,
          step5_completed: currentStep === 5 ? true : prev?.step5_completed,
        }));

        // Force navigation forward by one step after successful submit
        updateStep(currentStep + 1, true);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error(`Error validating step ${currentStep}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showErrorToast(errorMessage);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const steps = ['Dirección', 'Estancia', 'Piso', 'Comunidad', 'Gestión'];

  const handleStepClick = async (step: number) => {
    if (step >= currentStep + 1) {
      setErrors(errorsDefault);
      try {
        const result = await validateAndSubmitStep(currentStep, formData, {
          showToast: true,
          isSubmitting: setIsSubmitting,
        });

        // Actualizar estado de errores
        if (result.fieldErrors) {
          setErrors(prev => ({
            ...prev,
            [currentStep]: {
              fields: result.fieldErrors || {},
            },
          }));
        }

        // Avanzar si la validación es exitosa
        if (result.isValid) {
          if (step === 6) {
            handleOpenModal();
          } else {
            updateStep(step);
            window.scrollTo(0, 0);
          }
        }
      } catch (error) {
        console.error('Error validando paso 1:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        showErrorToast(errorMessage);
      }
    } else if (step <= currentStep) {
      updateStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Render the appropriate step component based on currentStep
  const renderStep = () => {
    switch (currentStep) {
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

  return (
    <div className="w-full py-8 pt-24">
      {/* Mobile Stepper - Only visible on smaller screens (up to 950px) */}
      <div className="mb-6 w-full px-4 lg:hidden">
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
        {/* Form content for mobile */}
        <div className="rounded-lg bg-white p-6 shadow-md">{renderStep()}</div>
      </div>
      {/* Desktop layout - Three columns: Stepper | Form | Messages */}
      <div className="mx-auto hidden max-w-[1100px] justify-center space-x-6 px-4 lg:flex">
        {/* Stepper - Left column */}
        <div className="flex-shrink-0" style={{ width: '150px' }}>
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
        <div className="flex-shrink-0 rounded-lg bg-white p-6 shadow-md md:w-[500px] lg:w-[700px]">
          {renderStep()}
        </div>

        {/* Space for message boxes - Right column - 24px gap */}
        <div className="hidden flex-shrink-0 lg:block" style={{ width: '200px' }}>
          <div className="sticky" style={{ top: '6rem' }}>
            <StaticFormMessagesContainer step={currentStep} isMobile={false} />
          </div>
        </div>
      </div>
      {isModalOpen && <ContactModal onClose={handleCloseModal} />}
    </div>
  );
};

export default AddReviewForm;
