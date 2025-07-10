import { useContext } from 'react';
import { FormMessagesContext } from '../store/formMessagesContext';
import type { FormMessagesContextType } from '../store/formMessagesTypes';

/**
 * Hook para usar el contexto de mensajes del formulario
 * @returns {FormMessagesContextType} Funciones y estado para gestionar los mensajes
 */
export function useFormMessages(): FormMessagesContextType {
  const context = useContext(FormMessagesContext);
  
  if (!context) {
    throw new Error('useFormMessages debe ser usado dentro de un FormMessagesProvider');
  }
  
  return context;
}
