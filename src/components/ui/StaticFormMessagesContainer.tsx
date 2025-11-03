import React, { useEffect, useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import StaticFormMessage from './StaticFormMessage';

interface StaticFormMessagesContainerProps {
  step: number;
  isMobile?: boolean;
}

const StaticFormMessagesContainer: React.FC<StaticFormMessagesContainerProps> = ({
  step,
  isMobile = false,
}) => {
  // Define helper messages per step
  const getMessagesForStep = () => {
    switch (step) {
      case 1:
        return [
          {
            id: 'step1-helping',
            title: "Amazing - you're already helping other riders find safe spots 💛",
            message: '',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 2:
        return [
          {
            id: 'step2-honest',
            title: "Be honest - every answer helps improve your street 🌱",
            message: '',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 3:
        return [
          {
            id: 'step3-safety',
            title: 'Safety & Security',
            message:
              'Your experience with bike security helps others decide if this hangar is right for them.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 4:
        return [
          {
            id: 'step4-usability',
            title: 'Usability & Impact',
            message:
              'Your feedback helps improve hangar design and shows councils the real impact on cycling.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 5:
        return [
          {
            id: 'step5-support',
            title: 'Just a few more taps - you\'re doing great ✨',
            message:
              'Your feedback on maintenance and support helps improve hangar services for everyone.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      default:
        return [];
    }
  };

  const messages = getMessagesForStep();

  // React to hover/focus on the lock icon in HashedContactInput
  const [privacyHover, setPrivacyHover] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // CustomEvent<boolean>
      const ce = e as CustomEvent<boolean>;
      setPrivacyHover(Boolean(ce.detail));
    };
    window.addEventListener('cv:privacyHover', handler as EventListener);
    return () => window.removeEventListener('cv:privacyHover', handler as EventListener);
  }, []);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={`${isMobile ? 'mt-2 w-full space-y-6' : ''}`}>
      {messages.map(msg => (
        <div key={msg.id} className="relative">
          {/* Icon overlay on hover */}
          {privacyHover && (
            <div className="pointer-events-none absolute left-3 top-3 text-green-600">
              <LockClosedIcon className="h-5 w-5" />
            </div>
          )}
          <StaticFormMessage
            title={msg.title}
            message={msg.message}
            backgroundColor={msg.backgroundColor}
            textColor={msg.textColor}
            className={`transition-transform duration-150 ${privacyHover ? 'scale-[1.05]' : ''}`}
            icon={msg.icon || undefined} 
          />
        </div>
      ))}
    </div>
  );
};

export default StaticFormMessagesContainer;
