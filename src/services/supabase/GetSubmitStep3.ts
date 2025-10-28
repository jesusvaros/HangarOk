import { supabaseWrapper } from './client';

interface HangarStep3Data {
  daytime_safety_rating: number | null;
  nighttime_safety_rating: number | null;
  bike_messed_with: boolean | null;
  current_bike_storage: string | null;
  theft_worry_rating: number | null;
  safety_tags: string[];
  photo_url: string | null;
}

export async function getHangarStep3Data(reviewSessionId: string): Promise<HangarStep3Data | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client.rpc('get_hangar_step3_data', {
      p_review_session_id: reviewSessionId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching step 3 data:', error);
    return null;
  }
}

export async function submitHangarStep3(payload: {
  reviewSessionId: string;
  daytimeSafetyRating: number | null | undefined;
  nighttimeSafetyRating: number | null | undefined;
  bikeMessedWith: boolean | null | undefined;
  currentBikeStorage: string | null | undefined;
  theftWorryRating: number | null | undefined;
  safetyTags: string[];
  photoUrl: string | null;
}): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client.rpc('upsert_hangar_step3_and_mark_session', {
      p_review_session_id: payload.reviewSessionId,
      p_daytime_safety_rating: payload.daytimeSafetyRating ?? null,
      p_nighttime_safety_rating: payload.nighttimeSafetyRating ?? null,
      p_bike_messed_with: payload.bikeMessedWith ?? null,
      p_current_bike_storage: payload.currentBikeStorage ?? null,
      p_theft_worry_rating: payload.theftWorryRating ?? null,
      p_safety_tags: payload.safetyTags,
      p_photo_url: payload.photoUrl,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting step 3 data:', error);
    return false;
  }
}
