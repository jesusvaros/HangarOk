import React from 'react';
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
            title: 'Tu opinión es anónima',
            message: 'La información que compartas no se mostrará de forma exacta.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
          },
        ];
      case 2:
        return [
          {
            id: 'step2-rental',
            title: 'Período de Alquiler',
            message:
              'Indica el período en el que has vivido o estás viviendo en la propiedad para contextualizar tu opinión.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
          },
        ];
      case 3:
        return [
          {
            id: 'step3-condition',
            title: 'Estado del Piso',
            message:
              'Evalúa las condiciones del piso para ayudar a futuros inquilinos a tomar decisiones informadas.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
          },
        ];
      case 4:
        return [
          {
            id: 'step4-community',
            title: 'Comunidad y Barrio',
            message:
              'La información sobre la comunidad de vecinos y el barrio es muy valiosa para futuros inquilinos.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
          },
        ];
      case 5:
        return [
          {
            id: 'step5-privacy',
            title: 'Privacidad',
            message:
              'Los datos personales se procesan mediante hashing irreversible solo para asociar opiniones con propietarios. Nunca se almacenan en texto claro ni se comparten con terceros.',
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#232C17',
          },
        ];
      default:
        return [];
    }
  };

  const messages = getMessagesForStep();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={`${isMobile ? 'mt-2 w-full space-y-6' : ''}`}>
      {messages.map((msg) => (
        <StaticFormMessage
          key={msg.id}
          title={msg.title}
          message={msg.message}
          backgroundColor={msg.backgroundColor}
          textColor={msg.textColor}
        />
      ))}
    </div>
  );
};

export default StaticFormMessagesContainer;
