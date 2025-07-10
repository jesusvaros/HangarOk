import { createContext } from 'react';
import type { FormMessagesContextType } from './formMessagesTypes';

// Contexto para los mensajes del formulario
export const FormMessagesContext = createContext<FormMessagesContextType | undefined>(undefined);
