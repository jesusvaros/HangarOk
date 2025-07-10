import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface FormMessage {
  id: string;
  title?: string;
  message: string;
  backgroundColor?: string;
  textColor?: string;
}

interface FormMessagesContextType {
  messages: FormMessage[];
  addMessage: (message: Omit<FormMessage, 'id'>) => string;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}

const FormMessagesContext = createContext<FormMessagesContextType | undefined>(undefined);

// Hook para usar el contexto de mensajes
function useFormMessages() {
  const context = useContext(FormMessagesContext);
  if (!context) {
    throw new Error('useFormMessages debe ser usado dentro de un FormMessagesProvider');
  }
  return context;
}

interface FormMessagesProviderProps {
  children: ReactNode;
}

export const FormMessagesProvider: React.FC<FormMessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<FormMessage[]>([]);

  const addMessage = (message: Omit<FormMessage, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMessage = { ...message, id };
    setMessages(prev => [...prev, newMessage]);
    return id;
  };

  const removeMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <FormMessagesContext.Provider value={{ messages, addMessage, removeMessage, clearMessages }}>
      {children}
    </FormMessagesContext.Provider>
  );
};

export { useFormMessages };
