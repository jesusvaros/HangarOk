import React from 'react';
import StaticFormMessage from './StaticFormMessage';

interface StaticFormMessagesContainerProps {
  step: number;
  isMobile?: boolean;
}

/**
 * Contenedor para mostrar mensajes estáticos según el paso del formulario
 * No utiliza useEffect ni contexto para evitar problemas de renderizado
 */
const StaticFormMessagesContainer: React.FC<StaticFormMessagesContainerProps> = ({ 
  step, 
  isMobile = false 
}) => {
  // Definir los mensajes para cada paso
  const getMessagesForStep = () => {
    switch (step) {
      case 1:
        return [
          {
            id: 'step1-anonymous',
            title: "Opinión Anónima",
            message: "Tu opinión es anónima. La información que compartas no se mostrará de forma exacta.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          }
        ];
      case 2:
        return [
          {
            id: 'step2-rental',
            title: "Período de Alquiler",
            message: "Indica el período en el que has vivido o estás viviendo en la propiedad para contextualizar tu opinión.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          }
        ];
      case 3:
        return [
          {
            id: 'step3-condition',
            title: "Estado del Piso",
            message: "Evalúa las condiciones del piso para ayudar a futuros inquilinos a tomar decisiones informadas.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          }
        ];
      case 4:
        return [
          {
            id: 'step4-community',
            title: "Comunidad y Barrio",
            message: "La información sobre la comunidad de vecinos y el barrio es muy valiosa para futuros inquilinos.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          }
        ];
      case 5:
        return [
          {
            id: 'step5-privacy',
            title: "Privacidad",
            message: "Los datos personales se procesan mediante hashing irreversible solo para asociar opiniones con propietarios. Nunca se almacenan en texto claro ni se comparten con terceros.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          },
          {
            id: 'step5-suggestions',
            title: "Sugerencias",
            message: "¿Fue fácil comunicarte? ¿Respondió rápido a tus consultas? ¿Fue profesional y respetuoso? Evita incluir datos personales, insultos o amenazas.",
            backgroundColor: 'rgb(225, 245, 110)',
            textColor: '#4A5E32'
          }
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
    <div className={`${isMobile ? 'space-y-3 w-full' : ''}`}>
      {messages.map((msg) => (
        <StaticFormMessage
          key={msg.id}
          title={msg.title}
          message={msg.message}
          backgroundColor={msg.backgroundColor}
          textColor={msg.textColor}
          className={`${isMobile ? 'mb-3' : ''}`}
        />
      ))}
    </div>
  );
};

export default StaticFormMessagesContainer;
