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
  const greenColor = 'rgb(74 94 50)'; // Green color for active and completed steps
  const lightGreenColor = 'rgba(74, 94, 50, 0.2)'; // Lighter green color for background
  
  return (
    <div className={`${isVertical ? 'h-full' : 'mb-0 overflow-x-auto w-full'}`}>
      <div className={`relative ${isVertical 
        ? 'flex flex-col justify-between items-start h-full mt-8' 
        : 'flex items-center justify-between w-full mt-0'}`}
      >
        {/* Línea de conexión */}
        <div 
          className={`absolute ${isVertical 
            ? 'left-4 top-1 bottom-1 w-0.5 bg-gray-300 -translate-x-1/2' 
            : 'left-[30px] right-[30px] top-4 h-0.5 bg-gray-300'}`} 
        />
        
        {/* Pasos */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;
          
          return (
            <div 
              key={index} 
              className={`relative z-10 cursor-pointer ${isVertical 
                ? 'flex items-center mb-10 last:mb-0' 
                : 'flex flex-col items-center min-w-[80px]'} `}
              onClick={() => onStepClick(index + 1)}
            >
              {/* Círculo */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Etiqueta */}
              <span 
                className={`${isVertical ? 'ml-3' : 'mt-2'} text-sm ${isVertical ? 'text-left' : 'text-center'} px-1 py-2 rounded-md block whitespace-nowrap`}
                style={{
                  backgroundColor: isActive ? lightGreenColor : 'transparent',
                  fontWeight: isActive ? 'bold' : 'normal',
                  height: '36px',
                  width: isVertical ? 'auto' : '100%'
                }}
              >
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
