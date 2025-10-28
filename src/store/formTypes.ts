// No need to import ReactNode here as it's not used in this file

export interface FormContextType {
  address: string;
  setAddress: (address: string) => void;
  formData: FormDataType;
  updateFormData: (data: Partial<FormDataType>) => void;
  resetForm: () => void;
}

export type FormDataType = {
  // Step 1: Hangar Location & Usage
  hangarLocation?: {
    street?: string;
    number?: string;
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
  usesHangar?: boolean; // true = "Yes — I have a space", false = "No — Not yet / Waiting / Nearby rider"
  homeType?: 'flat' | 'house' | 'shared' | 'other'; // Flat / House / Shared housing / Something else
  connectionType?: 'rent_space' | 'used_to' | 'live_near' | 'park_sometimes'; // How you use this hangar

  // Step 2: Rental Period
  startYear?: number;
  endYear?: number | null;
  price?: number;
  includedServices?: string[];
  // Would you recommend this flat? 1-5 stored as string tags
  wouldRecommend?: '1' | '2' | '3' | '4' | '5';
  // Deposit returned when tenant no longer lives there
  depositReturned?: boolean;

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
  ownerNameHash?: string;
  ownerPhone?: string;
  ownerPhoneHash?: string;
  ownerEmail?: string;
  ownerEmailHash?: string;
  ownerOpinion?: string;
  checkboxReadTerms?: boolean;

  // Contact Information (Modal)
  contactName?: string;
  contactEmail?: string;
  addressAutocompleteResult?: import('../components/ui/AddressAutocomplete').AddressResult;
};

export const initialFormData: FormDataType = {
  // Step 1: Hangar Location & Usage
  hangarLocation: {
    street: '',
    number: '',
    city: '',
    postalCode: '',
  },
  usesHangar: undefined,
  homeType: undefined,
  connectionType: undefined,

  // Step 2: Rental Period
  price: undefined,
  includedServices: [],
  startYear: 2025,
  endYear: undefined,
  wouldRecommend: undefined,
  depositReturned: undefined,

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
