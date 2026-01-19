import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';

// Define types for the hangar step 1 data (database format)
interface HangarStep1Data {
  hangar_location: {
    street?: string;
    number?: string;
    city?: string;
    postalCode?: string;
    coordinates?: { lat: number; lng: number };
    fullAddress?: string;
  };
  uses_hangar: boolean;
  hangar_access_status?: 'waiting_list' | 'no_hangar_nearby' | null;
  open_to_swap?: boolean;
  home_type: 'flat' | 'house' | 'shared' | 'other';
  connection_type: 'rent_space' | 'used_to' | 'live_near' | 'park_sometimes';
  hangar_number?: string | null;
}

// Alias for backward compatibility with old code
export type AddressStepData = HangarStep1Data;

export interface HangarStep1Payload {
  hangarLocation: {
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
  };
  hangarNumber?: string; // NEW: Hangar number (independent from address)
  usesHangar: boolean;
  hangarAccessStatus?: 'waiting_list' | 'no_hangar_nearby';
  openToSwap?: boolean | null;
  homeType: 'flat' | 'house' | 'shared' | 'other';
  connectionType: 'rent_space' | 'used_to' | 'live_near' | 'park_sometimes';
}

// Note: AddressStep1Payload is exported from types.ts for backward compatibility

export async function getAddressStep1Data(sessionIdExternal?: string): Promise<HangarStep1Data | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to get step 1 data
    const { data, error } = await client.rpc('get_hangar_step1_data', {
      p_review_session_id: sessionIdExternal || sessionId,
    });

    if (error) throw error;

    // If no data found, return null
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching hangar step 1 data:', error);
    return null;
  }
}

export async function submitAddressStep1(payload: HangarStep1Payload): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    if (!sessionId) {
      throw new Error('No session ID found');
    }

    // Transform payload to match database schema
    const { error } = await client.rpc('upsert_hangar_step1_and_mark_session', {
      p_review_session_id: sessionId,
      p_hangar_location: {
        street: payload.hangarLocation.street,
        number: payload.hangarLocation.number, // Hidden field (kept for DB compatibility)
        city: payload.hangarLocation.city,
        postalCode: payload.hangarLocation.postalCode,
        fullAddress: payload.hangarLocation.fullAddress,
        coordinates: payload.hangarLocation.coordinates,
      },
      p_hangar_number: payload.hangarNumber || null,
      p_uses_hangar: payload.usesHangar,
      p_hangar_access_status: payload.hangarAccessStatus || null,
      p_open_to_swap: payload.openToSwap !== undefined ? payload.openToSwap : null,
      p_home_type: payload.homeType,
      p_connection_type: payload.connectionType,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting hangar step 1 data:', error);
    return false;
  }
}
