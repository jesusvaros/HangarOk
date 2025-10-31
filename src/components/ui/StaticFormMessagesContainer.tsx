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
  // Definir los mensajes para cada paso
  const getMessagesForStep = () => {
    switch (step) {
      case 1:
        return [
          {
            id: 'step1-anonymous',
            title: "Your review is totally anonymous",
            message: 'No names, no tracking - just honest rider feedback. Your street is shown roughly on the map to help others, but your identity stays private.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 2:
        return [
          {
            id: 'step2-vibe',
            title: "What's the vibe on your street?",
            message: 'We\'re not judging - we just want to know how it feels. Does your hangar fit in, or do people side-eye it? Every view helps councils plan better and normalise bike storage on our streets.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 3:
        return [
          {
            id: 'step3-safety',
            title: 'Your safety insight matters',
            message:
              'Tell us what it\'s really like. Is it well-lit? Do you worry about theft? Has it been tampered with? Your experience helps make cycling safer for everyone - and keeps hangars honest.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 4:
        return [
          {
            id: 'step4-usability',
            title: 'Be real about usability',
            message:
              'Heavy doors, jammed locks, missing space - we\'ve all been there. Let us know what works (and what doesn\'t) so others can ride with confidence. Your review shapes real change.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
            icon: undefined,
          },
        ];
      case 5:
        return [
          {
            id: 'step5-support',
            title: 'Accountability starts here',
            message:
              'If something breaks, who fixes it - council, supplier, or no one? Your answers help map where systems fail and where they work. Because good maintenance means more bikes on the street.',
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
