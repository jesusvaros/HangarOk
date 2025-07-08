import React from 'react';

interface StepperBarProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

const StepperBar: React.FC<StepperBarProps> = ({ 
  currentStep, 
  steps, 
  onStepClick, 
  orientation = 'horizontal' 
}) => {
  const isVertical = orientation === 'vertical';
  const greenColor = 'rgb(74 94 50)';
  
  return (
    <div className={`${isVertical ? 'h-full' : 'mb-0'}`}>
      <div className={`relative ${isVertical 
        ? 'flex flex-col justify-between items-start h-full' 
        : 'flex justify-between items-center'}`}
      >
        {/* Línea de conexión */}
        <div 
          className={`absolute ${isVertical 
            ? 'left-3 top-0 bottom-0 w-0.5 bg-gray-300 -translate-x-1/2' 
            : 'left-0 right-0 top-3 h-0.5 bg-gray-300 -translate-y-1/2'}`} 
        />
        
        {/* Pasos */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          
          return (
            <div 
              key={index} 
              className={`relative z-10 ${isVertical 
                ? 'flex items-center mb-8 last:mb-0' 
                : 'flex flex-col items-center'}`}
            >
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
              <span className={`${isVertical ? 'ml-3' : 'mt-2'} text-xs ${isVertical ? 'text-left' : 'text-center'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperBar;
