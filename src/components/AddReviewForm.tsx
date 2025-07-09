import React, { useState, useEffect } from 'react';
import { useFormContext } from '../store/useFormContext';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2RentalPeriod from './review-steps/Step2RentalPeriod';
import Step3PropertyCondition from './review-steps/Step3PropertyCondition';
import Step4Community from './review-steps/Step4Community';
import Step5Owner from './review-steps/Step5Owner';
import EmailConfirmation from './review-steps/EmailConfirmation';
import ContactModal from './ui/ContactModal';
import StepperBar from './ui/StepperBar';

/**
 * AddReviewForm - Main wrapper component for the 5-step form
 * This component manages the step navigation and form submission
 */
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      contactEmail: contactData.contactEmail
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
    <div className="w-full py-8 pt-24 pb-36">
      {isSubmitted ? (
        <div className="max-w-2xl mx-auto px-4">
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
          <div className="w-full mb-6 lg:hidden px-4">
            <StepperBar 
              currentStep={currentStep} 
              steps={steps} 
              onStepClick={handleStepClick} 
              orientation="horizontal"
            />
          </div>

          <div className="flex justify-center px-4 lg:px-0 max-w-[1100px] mx-auto">
            {/* Stepper Bar - Left column - Only visible on larger screens (950px+) */}
            <div className="hidden lg:block w-[18%] max-w-[200px] flex-shrink-0">
              <div className="sticky top-16">
                <StepperBar
                  currentStep={currentStep}
                  steps={steps}
                  onStepClick={handleStepClick}
                  orientation="vertical"
                />
              </div>
            </div>
            
            {/* Form content - Center column */}
            <div className="w-full lg:w-[600px] flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-16 relative">
                {renderStep()}
              </div>
            </div>
            
            {/* Space for message boxes - Right column */}
            <div className="hidden lg:block w-[18%] max-w-[200px] flex-shrink-0 ml-6">
              {/* Message boxes will be positioned absolutely from the form elements */}
            </div>
          </div>

          {isModalOpen && (
            <ContactModal
              onClose={handleCloseModal}
              onSubmit={handleContactSubmit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AddReviewForm;
