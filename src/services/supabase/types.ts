// Define types for our database

export interface ReviewSessionStatus {
  id: string;
  session_id: string;
  session_token?: string;
  user_id?: string | null;
  created_at: string;
  updated_at?: string;
  completed?: boolean;
  validated?: boolean;
  step1_completed?: boolean;
  step2_completed?: boolean;
  step3_completed?: boolean;
  step4_completed?: boolean;
  step5_completed?: boolean;
  step_1_completed?: boolean;
  step_2_completed?: boolean;
  step_3_completed?: boolean;
  step_4_completed?: boolean;
  step_5_completed?: boolean;
}

export interface AddressStep1Payload {
  addressDetails: {
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
}
