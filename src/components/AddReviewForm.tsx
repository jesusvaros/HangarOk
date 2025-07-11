import React, { useState, useEffect, useRef } from 'react';
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
import { createReviewSession } from '../supabaseClient';

/**
 * AddReviewForm - Main wrapper component for the 5-step form
 * This component manages the step navigation and form submission
 */
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  // _sessionId will be used once the form payload is persisted
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_sessionId, setSessionId] = useState<string | null>(null);
  // Prevent double session creation in React 18 StrictMode (dev)
  const sessionInitRef = useRef(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize or retrieve review session ID
  useEffect(() => {
    if (sessionInitRef.current) return; // Prevent double run in React 18 StrictMode dev
    sessionInitRef.current = true;

    const initSession = async () => {
      const storedId = localStorage.getItem('reviewSessionId');
      if (storedId && storedId !== 'PENDING') {
        setSessionId(storedId);
      } else {
        // Mark localStorage to avoid other tabs/instances creating another session
          localStorage.setItem('reviewSessionId', 'PENDING');
          const generatedId = await createReviewSession();
        if (generatedId) {
          localStorage.setItem('reviewSessionId', generatedId);
          setSessionId(generatedId);
        }
      }
    };

    initSession();
  }, []);

  // Handle responsive layout
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.body.style.padding = '0px';
      } else {
        document.body.style.padding = '0px';
      }
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Go to next step
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
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

  // Handle form submission
  const handleSubmit = () => {
    try {
      // Aquí iría la lógica para enviar los datos a la API
      console.log('Formulario enviado:', formData);
      setIsModalOpen(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error al guardar la opinión:', err);
    }
  };

  // Handle contact data submission from modal
  const handleContactSubmit = (contactData: { contactName: string; contactEmail: string }) => {
    // Update form data with contact information
    updateFormData({
      contactName: contactData.contactName,
      contactEmail: contactData.contactEmail,
    });

    // Submit the form
    handleSubmit();
  };

  // Stepper bar with steps
  const steps = ['Dirección', 'Estancia', 'Piso', 'Comunidad', 'Gestión'];

  // Manejar el clic en un paso del stepper
  const handleStepClick = (step: number) => {
    // Solo permitir navegar a pasos anteriores o al siguiente paso
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };

  // Render the appropriate step component based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ObjectiveData onNext={handleNext} />;
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
