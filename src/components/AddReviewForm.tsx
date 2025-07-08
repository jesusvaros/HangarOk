import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../store/useFormContext';
import Step1ObjectiveData from './review-steps/Step1ObjectiveData';
import Step2Opinions from './review-steps/Step2Opinions';
import Step3Contact from './review-steps/Step3Contact';
import EmailConfirmation from './review-steps/EmailConfirmation';

/**
 * AddReviewForm - Main wrapper component for the 3-step form
 * This component manages the step navigation and form submission
 */
const AddReviewForm: React.FC = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Go to next step
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowEmailConfirm(true);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (showEmailConfirm) {
      setShowEmailConfirm(false);
      return;
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (showEmailConfirm) {
      setIsLoading(true);
      setError(null);
      
      try {
        updateFormData({ email });
        console.log("Form submitted with data:", { ...formData, email });
        // Here you would typically send the data to your backend
        navigate('/');
      } catch (err) {
        setError('Error al guardar la opinión. Por favor, inténtalo de nuevo.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      nextStep();
    }
  };

  // Progress indicator component with clickable steps
  const ProgressBar = () => {
    // Handle step navigation when clicking on a step indicator
    const handleStepClick = (step: number) => {
      // Only allow navigation to steps that have been visited or the next step
      if (step <= Math.max(currentStep, 1) || step === currentStep + 1) {
        if (step === 4) {
          // Step 4 is email confirmation
          setShowEmailConfirm(true);
        } else {
          setCurrentStep(step);
          setShowEmailConfirm(false);
        }
      }
    };
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => {
            // Determine if this step is the current step
            const isCurrentStep = (showEmailConfirm && step === 4) || (!showEmailConfirm && step === currentStep);
            // Determine if this step is completed
            const isCompleted = (!showEmailConfirm && step < currentStep) || (showEmailConfirm && step < 4);
            // Determine if this step is accessible (already visited or next step)
            const isAccessible = step <= Math.max(currentStep, 1) || step === currentStep + 1;
            
            return (
              <div 
                key={step} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => isAccessible ? handleStepClick(step) : null}
              >
                {/* Circle with number or checkmark */}
                <div 
                  className={`
                    flex items-center justify-center 
                    w-9 h-9 rounded-full mb-2 
                    ${isCurrentStep ? 'bg-orange-500 text-white font-bold' : 
                      isCompleted ? 'bg-gray-300 text-white' :
                      isAccessible ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'} 
                    ${isAccessible && !isCompleted ? 'hover:bg-orange-100 hover:border-orange-500 border border-transparent' : ''} 
                    transition-all duration-200
                  `}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                
                {/* Step name */}
                <span 
                  className={`
                    text-center text-sm 
                    ${isCurrentStep ? 'font-bold text-orange-500' : 
                      isCompleted ? 'font-medium text-gray-600' :
                      isAccessible ? 'text-gray-700' : 'text-gray-400'}
                  `}
                >
                  {step === 1 && 'Datos de la vivienda'}
                  {step === 2 && 'Experiencia'}
                  {step === 3 && 'Información sensible'}
                  {step === 4 && 'Confirmación'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render the appropriate step component based on currentStep
  const renderCurrentStep = () => {
    if (showEmailConfirm) {
      return (
        <EmailConfirmation 
          email={email}
          setEmail={setEmail}
          onSubmit={handleSubmit}
          onBack={prevStep}
        />
      );
    }
    
    switch (currentStep) {
      case 1:
        return <Step1ObjectiveData onNext={nextStep} />;
      case 2:
        return <Step2Opinions onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <Step3Contact onNext={nextStep} onPrev={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <div className="max-w-2xl mx-auto p-6">
        <ProgressBar />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          {renderCurrentStep()}
        </form>
      </div>
    </div>
  );
};

export default AddReviewForm;
