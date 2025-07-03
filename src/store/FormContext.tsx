import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { FormDataType } from './formTypes';
import { initialFormData } from './formTypes';
import { FormContext } from './FormContextInstance';

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState('');
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  
  const updateFormData = (data: Partial<FormDataType>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setAddress('');
  };
  
  return (
    <FormContext.Provider value={{ 
      address, 
      setAddress, 
      formData, 
      updateFormData,
      resetForm
    }}>
      {children}
    </FormContext.Provider>
  );
};

// useFormContext hook has been moved to its own file
