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
import { getAddressStep1Data } from '../services/supabase/address';

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
  const [errors, setErrors] = useState<Record<number, { fields: Record<string, boolean> }>>({
    1: { fields: { street: false, number: false } },
  });

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

  const fetchStep1Data = useCallback(async () => {
    const addressData = await getAddressStep1Data();

    if (addressData) {
      updateFormData({
        addressDetails: addressData.address_details,
      });
    }
  }, [updateFormData]);

  useEffect(() => {
    const initSession = async () => {
      const { sessionStatus } = await initializeSession();

      if (sessionStatus?.step1_completed) {
        fetchStep1Data();
      }
    };
    initSession();
  }, [fetchStep1Data]);

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
      setErrors(prev => ({
        ...prev,
        1: { fields: { street: false, number: false } },
      }));
      setIsSubmitting(true);
      try {
        const result = await validateAndSubmitStep(currentStep, formData, {
          showToast: true,
          isSubmitting: setIsSubmitting,
        });

        // Actualizar estado de errores
        if (result.fieldErrors) {
          setErrors(prev => ({
            ...prev,
            [step]: {
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
      } finally {
        setIsSubmitting(false);
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
        return <Step2RentalPeriod onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <Step3PropertyCondition onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <Step4Community onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <Step5Owner onNext={handleOpenModal} onPrevious={handlePrevious} />;
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
