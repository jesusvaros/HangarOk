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

  // Progress bar component
  const ProgressBar = () => {
    const totalSteps = showEmailConfirm ? 4 : 3;
    const currentProgress = showEmailConfirm ? 4 : currentStep;
    const percentage = (currentProgress / totalSteps) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-1">
          {[1, 2, 3, 4].map((step) => (
            <div 
              key={step} 
              className={`text-xs font-medium ${step <= currentProgress ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {step === 1 && 'Datos Objetivos'}
              {step === 2 && 'Opiniones'}
              {step === 3 && 'Contacto'}
              {step === 4 && 'Confirmación'}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${percentage}%` }}
          ></div>
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Añadir Opinión</h1>
        
        <ProgressBar />
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          {renderCurrentStep()}
          
          <div className="flex justify-between items-center pt-6 border-t mt-6">
            <button
              type="button"
              onClick={prevStep}
              className="text-blue-600 hover:text-blue-800"
            >
              {currentStep === 1 ? 'Cancelar' : 'Anterior'}
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Enviando...' : 
               showEmailConfirm ? 'Enviar opinión' : 
               currentStep === 3 ? 'Continuar' : 'Siguiente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReviewForm;
