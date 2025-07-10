/**
 * Tipos para el sistema de mensajes del formulario
 */

export interface FormMessage {
  id: string;
  title?: string;
  message: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FormMessagesContextType {
  messages: FormMessage[];
  addMessage: (message: Omit<FormMessage, 'id'>) => string;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
}
