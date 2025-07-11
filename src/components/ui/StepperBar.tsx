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
  orientation = 'horizontal',
}) => {
  const isVertical = orientation === 'vertical';
  const greenColor = 'rgb(74 94 50)'; // Green color for active and completed steps
  const lightGreenColor = 'rgba(74, 94, 50, 0.2)'; // Lighter green color for background

  return (
    <div className={`${isVertical ? 'h-full' : 'mb-0 w-full overflow-x-auto'}`}>
      <div
        className={`relative ${
          isVertical
            ? 'mt-8 flex h-full flex-col items-start justify-between'
            : 'mt-0 flex w-full items-center'
        }`}
      >
        {/* Build circles and connector segments */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          // Circle element for the step
          return (
            <div key={`circle-${index}`} className="relative">
              <div
                className={`relative z-10 cursor-pointer ${
                  isVertical ? 'mb-10 flex items-center last:mb-0' : 'flex flex-col items-center'
                } `}
                onClick={() => onStepClick(index + 1)}
              >
                {/* Círculo */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                        ? 'text-white'
                        : 'bg-gray-300 text-gray-600'
                  }`}
                  style={{
                    backgroundColor: isActive || isCompleted ? greenColor : undefined,
                  }}
                  aria-label={`Ir al paso ${index + 1}: ${step}`}
                >
                  {isCompleted ? (
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {/* Etiqueta */}
                <span
                  className={`${isVertical ? 'ml-3' : 'mt-2'} text-sm ${isVertical ? 'text-left' : 'text-center'} block whitespace-nowrap rounded-md px-3 py-2`}
                  style={{
                    backgroundColor: isActive ? lightGreenColor : 'transparent',
                    fontWeight: isActive ? 'bold' : 'normal',
                    height: '36px',
                    width: isVertical ? 'auto' : '100%',
                  }}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  key={`connector-${index}`}
                  className={` absolute ${isVertical ? `  top-[30px]  ml-4 h-[50px] w-0.5` : ' left-[45px] top-[15px] -ml-4 h-0.5 w-[100%] self-center  bg-gray-300'}`}
                  style={{ backgroundColor: isCompleted ? greenColor : '#d1d5db' }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperBar;
