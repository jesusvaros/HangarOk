import React from 'react';
import { useFormMessages } from '../../hooks/useFormMessages';
import type { FormMessage as FormMessageType } from '../../store/formMessagesTypes';
import FormMessage from './FormMessage';

interface FormMessagesContainerProps {
  isMobile?: boolean;
}

/**
 * Contenedor para mostrar mensajes del formulario
 * Se puede usar en versión móvil o desktop
 */
const FormMessagesContainer: React.FC<FormMessagesContainerProps> = ({ isMobile = false }) => {
  const { messages } = useFormMessages();

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={`${isMobile ? 'space-y-3 w-full' : 'pl-6'}`}>
      {messages.map((msg: FormMessageType) => (
        <FormMessage
          key={msg.id}
          title={msg.title}
          message={msg.message}
          backgroundColor={msg.backgroundColor || 'rgb(225, 245, 110)'}
          textColor={msg.textColor || '#4A5E32'}
          className={`${isMobile ? 'mb-3 lg:hidden' : ''}`}
        />
      ))}
    </div>
  );
};

export default FormMessagesContainer;
