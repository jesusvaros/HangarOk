import React, { useState, useEffect, useCallback } from 'react';
import { useFormContext } from '../store/useFormContext';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2RentalPeriod from './review-steps/Step2RentalPeriod';
import Step3PropertyCondition from './review-steps/Step3PropertyCondition';
import Step4Community from './review-steps/Step4Community';
import Step5Owner from './review-steps/Step5Owner';
import EmailConfirmation from './review-steps/EmailConfirmation';
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

/**
 * AddReviewForm - Main wrapper component for the 5-step form
 * This component manages the step navigation and form submission
 */
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const errorsDefault = {
    1: { fields: { street: false, number: false } },
    2: { fields: { startDate: false, endDate: false, montlyPrice: false } },
    3: { fields: { summerTemperature: false, winterTemperature: false, noiseLevel: false, lightLevel: false, maintenanceStatus: false } },
    4: { fields: { neighborTypes: false, communityEnvironment : false } },
    5: { fields: { owner: false } },
  };
  const [errors, setErrors] =
    useState<Record<number, { fields: Record<string, boolean> }>>(errorsDefault);

  //mobile layout
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.padding = '0px';
      } else {
        document.body.style.padding = '0px';
      }
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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


 //session
  useEffect(() => {
    const initSession = async () => {
      const { sessionStatus } = await initializeSession();
      if (sessionStatus?.step1_completed) {
        fetchStep1Data();
      }
      if (sessionStatus?.step2_completed) {
        fetchStep2Data();
      }
      if (sessionStatus?.step3_completed) {
        fetchStep3Data();
      }
      if (sessionStatus?.step4_completed) {
        fetchStep4Data();
      }
    };
    initSession();
  }, [fetchStep1Data, fetchStep2Data, fetchStep3Data, fetchStep4Data]);

  const handleNext = async () => {
    if (currentStep < 5) {
      handleStepClick(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    try {
      console.log('Formulario enviado:', formData);
      setIsModalOpen(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al guardar la opinión:', err);
    }
  };

  const handleContactSubmit = (contactData: { contactName: string; contactEmail: string }) => {
    updateFormData({
      contactName: contactData.contactName,
      contactEmail: contactData.contactEmail,
    });
    handleSubmit();
  };

  const steps = ['Dirección', 'Estancia', 'Piso', 'Comunidad', 'Gestión'];

  const handleStepClick = async (step: number) => {
    if (step === currentStep + 1) {
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
        if (result.isValid && result.isSubmitted) {
          setCurrentStep(step);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error('Error validando paso 1:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        showErrorToast(errorMessage);
      }
    } else if (step <= currentStep) {
      // Permitir siempre navegar hacia atrás
      setCurrentStep(step);
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
        return <Step2RentalPeriod onNext={handleNext} onPrevious={handlePrevious} fieldErrors={errors[2]?.fields} />;
      case 3:
        return <Step3PropertyCondition onNext={handleNext} onPrevious={handlePrevious} fieldErrors={errors[3]?.fields} />;
      case 4:
        return <Step4Community onNext={handleNext} onPrevious={handlePrevious} fieldErrors={errors[4]?.fields} />;
      case 5:
        return <Step5Owner onNext={handleOpenModal} onPrevious={handlePrevious} fieldErrors={errors[5]?.fields}/>;
      default:
        return <Step1ObjectiveData onNext={handleNext} />;
    }
  };

  return (
    <div className="w-full py-8 pt-24">
      {isSubmitted ? (
        <div className="mx-auto max-w-2xl px-4">
          <EmailConfirmation
            email={formData.contactEmail || ''}
            setEmail={() => {}}
            onSubmit={() => {}}
            onBack={() => {}}
          />
        </div>
      ) : (
        <>
          {/* Mobile Stepper - Only visible on smaller screens (up to 950px) */}
          <div className="mb-6 w-full px-4 lg:hidden">
            <StepperBar
              currentStep={currentStep}
              steps={steps}
              onStepClick={handleStepClick}
              orientation="horizontal"
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
                />
              </div>
            </div>

            {/* Form content - Center column - Fixed width */}
            <div className="flex-shrink-0 rounded-lg bg-white p-6 shadow-md md:w-[500px] lg:w-[650px]">
              {renderStep()}
            </div>

            {/* Space for message boxes - Right column - 24px gap */}
            <div className="hidden flex-shrink-0 lg:block" style={{ width: '200px' }}>
              <div className="sticky" style={{ top: '6rem' }}>
                <StaticFormMessagesContainer step={currentStep} isMobile={false} />
              </div>
            </div>
          </div>

          {isModalOpen && (
            <ContactModal onClose={handleCloseModal} onSubmit={handleContactSubmit} />
          )}
        </>
      )}
    </div>
  );
};

export default AddReviewForm;
