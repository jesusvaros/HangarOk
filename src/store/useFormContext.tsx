import { useContext } from 'react';
import { FormContext } from './FormContextInstance';
import type { FormContextType } from './formTypes';

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
