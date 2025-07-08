import React, { useState } from 'react';
import { useFormContext } from '../store/useFormContext';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2RentalPeriod from './review-steps/Step2RentalPeriod';
import Step3PropertyCondition from './review-steps/Step3PropertyCondition';
import Step4Owner from './review-steps/Step4Owner.tsx';
import EmailConfirmation from './review-steps/EmailConfirmation';
import ContactModal from './ui/ContactModal';
import StepperBar from './ui/StepperBar';

/**
 * AddReviewForm - Main wrapper component for the 4-step form
 * This component manages the step navigation and form submission
 */
const AddReviewForm: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Go to next step
  const handleNext = () => {
    if (currentStep < 4) {
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
  const steps = ['Dirección', 'Estancia', 'Valoración', 'Gestión'];
  
  // Manejar el clic en un paso del stepper
  const handleStepClick = (step: number) => {
    // Solo permitir navegar a pasos anteriores o al siguiente paso
    if (step <= currentStep || step === currentStep + 1) {
      setCurrentStep(step);
      window.scrollTo(0, 0);
    }
  };
  
  const renderProgressBar = () => {
    return <StepperBar currentStep={currentStep} steps={steps} onStepClick={handleStepClick} />;
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
        return <Step4Owner onNext={handleOpenModal} onPrevious={handlePrevious} />;
      default:
        return <Step1ObjectiveData onNext={handleNext} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <div className="max-w-2xl mx-auto p-6">
        {isSubmitted ? (
          <EmailConfirmation 
            email={formData.contactEmail || ''} 
            setEmail={() => {}} 
            onSubmit={() => {}} 
            onBack={() => {}}
          />
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            {renderProgressBar()}
            {renderStep()}
            {isModalOpen && (
              <ContactModal 
                onClose={handleCloseModal} 
                onSubmit={handleContactSubmit}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddReviewForm;
