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
    state?: string;
    fullAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    components?: {
      road?: string;
      house_number?: string;
      city?: string;
      town?: string;
      village?: string;
      postcode?: string;
      state?: string;
      [key: string]: string | undefined;
    };
  };

  // Step 2: Rental Period
  startYear?: number;
  endYear?: number | null;
  price?: number;
  includedServices?: string[];
  

  // Step 3: Property Condition
  summerTemperature?: 'Bien aislado' | 'Correcto' | 'Caluroso';
  winterTemperature?: 'Bien aislado' | 'Correcto' | 'Frío';
  noiseLevel?: 'Silencioso' | 'Tolerable' | 'Bastante' | 'Se oye todo';
  lightLevel?: 'Nada de luz' | 'Poca luz' | 'Luminoso' | 'Muy luminoso';
  maintenanceStatus?: 'Como nuevo' | 'Bueno' | 'Aceptable' | 'Poco' | 'Malo';
  propertyOpinion?: string;

  // Step 4: Community
  neighborTypes?: string[];
  touristApartments?: 'Sí, tolerable' | 'Sí, molestos' | 'No hay';
  buildingCleanliness?: 'Muy limpio' | 'Buena' | 'Poca' | 'Sin limpieza';
  communityEnvironment?: string[];
  communitySecurity?: 'Muy segura' | 'Sin problemas' | 'Mejorable' | 'Poco segura';
  communityOpinion?: string;

  // Step 5: Owner
  ownerType?: 'Particular' | 'Agencia';
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerOpinion?: string;
  checkboxReadTerms?: boolean;

  // Contact Information (Modal)
  contactName?: string;
  contactEmail?: string;
  addressAutocompleteResult?: import('../components/ui/AddressAutocomplete').AddressResult;
};

export const initialFormData: FormDataType = {
  addressDetails: {
    street: '',
    number: '',
    floor: '',
    door: '',
    city: '',
    postalCode: '',
  },

  // Step 2: Rental Period
  price: undefined,
  includedServices: [],
  startYear: undefined,
  endYear: undefined,

  // Step 3: Property Condition
  summerTemperature: undefined,
  winterTemperature: undefined,
  noiseLevel: undefined,
  lightLevel: undefined,
  maintenanceStatus: undefined,
  propertyOpinion: '',

  // Step 4: Community
  neighborTypes: [],
  touristApartments: undefined,
  buildingCleanliness: undefined,
  communityEnvironment: [],
  communitySecurity: undefined,
  communityOpinion: '',

  // Step 5: Owner
  ownerType: 'Particular',
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  ownerOpinion: '',
  checkboxReadTerms: false,

  // Contact Information (Modal)
  contactName: '',
  contactEmail: '',
};
