import React from 'react';
import type { SessionStatus } from '../AddReviewForm';

interface StepperBarProps {
  currentStep: number;
  steps: string[];
  onStepClick: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  sessionStatus?: SessionStatus | null;
}

const StepperBar: React.FC<StepperBarProps> = ({
  currentStep,
  steps,
  onStepClick,
  orientation = 'horizontal',
  sessionStatus,
}) => {
  const isVertical = orientation === 'vertical';
  const greenColor = 'rgb(74 94 50)'; // Green color for active and completed steps
  const lightGreenColor = 'rgba(74, 94, 50, 0.2)'; // Lighter green color for background
  const stepsCompleted = [
    sessionStatus?.step1_completed,
    sessionStatus?.step2_completed,
    sessionStatus?.step3_completed,
    sessionStatus?.step4_completed,
    sessionStatus?.step5_completed,
  ];

  return (
    <div
      className={`${isVertical ? 'h-full' : 'mb-0 w-full overflow-x-auto pb-4'} hide-scrollbar `}
    >
      <div
        className={`relative ${
          isVertical
            ? 'mt-8 flex h-full flex-col items-start justify-between'
            : 'mt-0 flex w-full justify-between flex'
        }`}
      >
        {/* Build circles and connector segments */}
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = !!(index + 1 < currentStep || stepsCompleted[index]);

          // Circle element for the step
          return (
            <div key={`circle-${index}`} className="relative">
              <div
                className={`relative z-10 cursor-pointer ${
                  isVertical
                    ? 'mb-10 flex items-center last:mb-0'
                    : 'flex flex-col items-center w-[100px]'
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
                    <span className="text-base font-semibold">{index + 1}</span>
                  )}
                </div>
                {/* Etiqueta */}
                <span
                  title={step}
                  className={`${isVertical ? 'ml-3' : 'mt-2'} text-base md:text-lg text-black ${isVertical ? 'text-left' : 'text-center'} block whitespace-nowrap truncate rounded-md px-3 py-2`}
                  style={{
                    backgroundColor: isActive ? lightGreenColor : 'transparent',
                    fontWeight: isActive ? 'bold' : 'normal',
                    // Wider fixed width on vertical so labels don't truncate too early
                    width: isVertical ? '160px' : '100%',
                  }}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  key={`connector-${index}`}
                  className={` absolute ${isVertical ? `  top-[35px]  ml-4 h-[55px] w-0.5` : 'left-[50px] top-[15px] ml-0 h-0.5 w-[100%] md:left-[60px] md:w-[190%]'}`}
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
