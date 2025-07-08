// No need to import ReactNode here as it's not used in this file

export interface FormContextType {
  address: string;
  setAddress: (address: string) => void;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  resetForm: () => void;
}

export interface FormDataType {
  // Step 1: Objective data
  address: string;
  addressDetails?: {
    streetAddress?: string;
    staircase?: string;
    floor?: string;
    door?: string;
  };
  rentalPrice: number;
  includedUtilities?: string[];
  ownerType: 'owner' | 'agency' | '';
  rentalPeriod: {
    startYear: number;
    endYear: number;
  };
  
  // Step 2: Opinions
  ownerRating: number;
  propertyConditionRating: number;
  comments: string;
  
  // Step 3: Contact info
  ownerName: string;
  ownerPhone: string;
  
  // Final step
  email: string;
}

export const initialFormData: FormDataType = {
  // Step 1
  address: '',
  rentalPrice: 0,
  ownerType: '',
  rentalPeriod: {
    startYear: new Date().getFullYear() - 1,
    endYear: new Date().getFullYear()
  },
  
  // Step 2
  ownerRating: 0,
  propertyConditionRating: 0,
  comments: '',
  
  // Step 3
  ownerName: '',
  ownerPhone: '',
  
  // Final step
  email: ''
};
