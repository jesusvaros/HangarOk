import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { FormMessagesContext } from './formMessagesContext';
import type { FormMessage } from './formMessagesTypes';

interface FormMessagesProviderProps {
  children: ReactNode;
}

export const FormMessagesProvider: React.FC<FormMessagesProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<FormMessage[]>([]);

  const addMessage = (message: Omit<FormMessage, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMessage = { ...message, id };
    setMessages((prev) => [...prev, newMessage]);
    return id;
  };

  const removeMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
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
