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
    number?: string; // Hidden field (kept for DB compatibility)
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
  hangarNumber?: string; // NEW: Hangar number (independent from address)
  usesHangar?: boolean; // true = "Yes - I have a space", false = "No - Not yet / Waiting / Nearby rider"
  homeType?: 'flat' | 'house' | 'shared' | 'other'; // Flat / House / Shared housing / Something else
  connectionType?: 'rent_space' | 'used_to' | 'live_near' | 'park_sometimes'; // How you use this hangar

  // Step 2: Community Perception
  belongsRating?: 1 | 2 | 3 | 4 | 5; // How well does this hangar belong here?
  fairUseRating?: 1 | 2 | 3 | 4 | 5; // Is it a fair use of space on this street?
  appearanceRating?: 1 | 2 | 3 | 4 | 5; // How does it look on your street?
  perceptionTags?: string[]; // Quick-select tags
  communityFeedback?: string; // What do people around here say about it?

  // Step 3: Safety and Security
  // For users WITH a hangar
  daytimeSafetyRating?: 1 | 2 | 3 | 4 | 5;
  nighttimeSafetyRating?: 1 | 2 | 3 | 4 | 5;
  bikeMessedWith?: boolean;
  // For users WITHOUT a hangar
  currentBikeStorage?: 'railings' | 'inside' | 'hallway' | 'nowhere_secure' | 'other';
  theftWorryRating?: 1 | 2 | 3 | 4 | 5;
  // Common
  safetyTags?: string[];

  // Step 4: Usability and Impact
  // For users WITH a hangar
  lockEaseRating?: 1 | 2 | 3 | 4 | 5;
  spaceRating?: 1 | 2 | 3 | 4 | 5;
  lightingRating?: 1 | 2 | 3 | 4 | 5;
  maintenanceRating?: 1 | 2 | 3 | 4 | 5;
  usabilityTags?: string[];
  improvementSuggestion?: string;
  // For users WITHOUT a hangar
  stopsCycling?: 'yes_lot' | 'yes_bit' | 'not_really' | 'no';
  impactTags?: string[];

  // Step 5: Maintenance and Support
  // For users WITH a hangar
  reportEaseRating?: 1 | 2 | 3 | 4 | 5;
  fixSpeedRating?: 1 | 2 | 3 | 4 | 5;
  communicationRating?: 1 | 2 | 3 | 4 | 5;
  maintenanceTags?: string[];
  // For users WITHOUT a hangar (waitlist)
  waitlistFairnessRating?: 1 | 2 | 3 | 4 | 5;
  waitlistTags?: string[];
  // Common
  improvementFeedback?: string;
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

  // Step 2: Community Perception
  belongsRating: undefined,
  fairUseRating: undefined,
  appearanceRating: undefined,
  perceptionTags: [],
  communityFeedback: '',

  // Step 3: Safety and Security
  daytimeSafetyRating: undefined,
  nighttimeSafetyRating: undefined,
  bikeMessedWith: undefined,
  currentBikeStorage: undefined,
  theftWorryRating: undefined,
  safetyTags: [],

  // Step 4: Usability and Impact
  lockEaseRating: undefined,
  spaceRating: undefined,
  lightingRating: undefined,
  maintenanceRating: undefined,
  usabilityTags: [],
  improvementSuggestion: '',
  stopsCycling: undefined,
  impactTags: [],

  // Step 5: Maintenance and Support
  reportEaseRating: undefined,
  fixSpeedRating: undefined,
  communicationRating: undefined,
  maintenanceTags: [],
  waitlistFairnessRating: undefined,
  waitlistTags: [],
  improvementFeedback: '',
  checkboxReadTerms: false,

  // Contact Information (Modal)
  contactName: '',
  contactEmail: '',
};
