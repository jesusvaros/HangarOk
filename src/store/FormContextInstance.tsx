import { createContext } from 'react';
import type { FormContextType } from './formTypes';

// Create the context
export const FormContext = createContext<FormContextType | undefined>(undefined);
