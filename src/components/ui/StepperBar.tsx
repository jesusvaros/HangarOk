import React from 'react';

interface StepperBarProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
}

const StepperBar: React.FC<StepperBarProps> = ({ currentStep, steps, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="relative flex justify-between items-center">
        {/* Línea de conexión */}
        <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-300 -translate-y-1/2" />
        
        {/* Pasos */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          const greenColor = 'rgb(74 94 50)';
          
          return (
            <div key={index} className="relative flex flex-col items-center z-10">
              {/* Círculo */}
              <button 
                onClick={() => onStepClick(index + 1)}
                className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
                  isActive 
                    ? 'text-white' 
                    : isCompleted 
                      ? 'text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}
                style={{
                  backgroundColor: isActive || isCompleted ? greenColor : undefined
                }}
                aria-label={`Ir al paso ${index + 1}: ${step}`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </button>
              
              {/* Etiqueta */}
              <span className="mt-2 text-xs text-center">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperBar;
