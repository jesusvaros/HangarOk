// No need to import ReactNode here as it's not used in this file

export interface FormContextType {
  address: string;
  setAddress: (address: string) => void;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  resetForm: () => void;
}

export type FormDataType = {
  // Step 1: Housing
  addressDetails?: {
    street?: string;
    number?: string;
    floor?: string;
    door?: string;
    city?: string;
    postalCode?: string;
  };
  price?: number;
  includedServices?: string[];
  
  // Step 2: Rental Period
  startYear?: number;
  endYear?: number;
  
  // Step 3: Property Condition
  summerTemperature?: 'Bien aislado' | 'Correcto' | 'Caluroso';
  winterTemperature?: 'Bien aislado' | 'Correcto' | 'Frío';
  noiseLevel?: 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo';
  lightLevel?: 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso';
  maintenanceStatus?: 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo';
  amenities?: string[];
  comments?: string;
  
  // Step 4: Owner
  ownerType?: 'Particular' | 'Agencia';
  ownerRating?: number;
  showOwnerContact?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  
  // Contact Information (Modal)
  contactName?: string;
  contactEmail?: string;
}

export const initialFormData: FormDataType = {
  addressDetails: {
    street: '',
    number: '',
    floor: '',
    door: '',
    city: '',
    postalCode: ''
  },
  price: undefined,
  includedServices: [],
  startYear: undefined,
  endYear: undefined,
  summerTemperature: undefined,
  winterTemperature: undefined,
  noiseLevel: undefined,
  lightLevel: undefined,
  maintenanceStatus: undefined,
  amenities: [],
  comments: '',
  ownerType: 'Particular',
  ownerRating: 0,
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  showOwnerContact: false,
  contactName: '',
  contactEmail: ''
};
