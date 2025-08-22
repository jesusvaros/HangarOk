import { getSessionIdBack } from '../sessionManager';
import { supabaseWrapper } from './client';
import { hashValue } from './hashValues';

interface SubmitStep5Payload {
  owner_type?: 'Particular' | 'Agencia';
  owner_name_hash?: string;
  owner_phone_hash?: string;
  owner_email_hash?: string;
  owner_opinion?: string;
}

interface SubmitStep5Payload {
  ownerType?: 'Particular' | 'Agencia';
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerOpinion?: string;
  ownerNameHash?: string;
  ownerPhoneHash?: string;
  ownerEmailHash?: string;
}

export async function getSessionStep5Data(id?: string): Promise<SubmitStep5Payload | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    // Using RPC call to match the insert pattern
    const { data, error } = await client.rpc('get_gestion_step5_data', {
      p_review_session_id: id || sessionId,
    });

    if (error) throw error;

    // If no data found, return null
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching address data:', error);
    return null;
  }
}

async function hashOwnerData({
  name,
  email,
  phone,
}: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<{
  nameHash?: string;
  emailHash?: string;
  phoneHash?: string;
}> {
  const nameHash = name ? await hashValue(name) : undefined;
  const emailHash = email ? await hashValue(email) : undefined;
  const phoneHash = phone ? await hashValue(phone) : undefined;

  return { nameHash, emailHash, phoneHash };
}

export async function submitSessionStep5(payload: SubmitStep5Payload): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const sessionId = await getSessionIdBack();

    const { nameHash, emailHash, phoneHash } = await hashOwnerData({
      name: payload.ownerName,
      email: payload.ownerEmail,
      phone: payload.ownerPhone,
    });

    const { error } = await client.rpc('upsert_gestion_step5_and_mark_review_session', {
      p_review_session_id: sessionId,
      p_owner_type: payload.ownerType,
      p_owner_name: nameHash || payload.ownerNameHash || null,
      p_owner_phone: phoneHash || payload.ownerPhoneHash || null,
      p_owner_email: emailHash || payload.ownerEmailHash || null,
      // checkear este campo con ia es legal?
      p_owner_opinion: payload.ownerOpinion,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting address data:', error);
    return false;
  }
}
