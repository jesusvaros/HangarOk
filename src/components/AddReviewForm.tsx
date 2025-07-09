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
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle responsive layout
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
  const steps = ['Dirección', 'Estancia', 'Valoración del piso', 'Comunidad y Barrio', 'Gestión'];
  
  // Manejar el clic en un paso del stepper
  const handleStepClick = (step: number) => {
    // Solo permitir navegar a pasos anteriores o al siguiente paso
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };
  
  // Stepper orientation is determined by screen size

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
    <div className="container mx-auto px-4 py-8 pt-24">
        {isSubmitted ? (
          <div className="max-w-2xl mx-auto">
            <EmailConfirmation 
              email={formData.contactEmail || ''} 
              setEmail={() => {}} 
              onSubmit={() => {}} 
              onBack={() => {}}
            />
          </div>
        ) : (
          <div className="md:flex md:gap-8 mt-8">
            {/* Stepper Bar - Vertical on desktop, horizontal on mobile */}
            <div className="md:sticky md:top-16 md:self-start md:h-auto md:max-h-[500px] md:flex-shrink-0 md:w-48 mb-6 md:mb-0">
              <div className="md:h-full">
                <StepperBar 
                  currentStep={currentStep} 
                  steps={steps} 
                  onStepClick={handleStepClick} 
                  orientation={isMobile ? 'horizontal' : 'vertical'}
                />
              </div>
            </div>
            
            {/* Form content */}
            <div className="md:flex-grow max-w-2xl mx-auto md:mx-0">
              {/* Single white box wrapping all form content */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {renderStep()}
              </div>
            </div>
            
            {isModalOpen && (
              <ContactModal 
                onClose={handleCloseModal} 
                onSubmit={handleContactSubmit}
              />
            )}
          </div>
        )}
    </div>
  );
};

export default AddReviewForm;
