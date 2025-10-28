import { supabaseWrapper } from './client';

interface HangarStep2Data {
  belongs_rating: number;
  fair_use_rating: number;
  appearance_rating: number;
  tags: string[];
  community_feedback: string | null;
}

export async function getHangarStep2Data(reviewSessionId: string): Promise<HangarStep2Data | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client.rpc('get_hangar_step2_data', {
      p_review_session_id: reviewSessionId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching step 2 data:', error);
    return null;
  }
}

export async function submitHangarStep2(payload: {
  reviewSessionId: string;
  belongsRating: number;
  fairUseRating: number;
  appearanceRating: number;
  tags: string[];
  communityFeedback: string | null;
}): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client.rpc('upsert_hangar_step2_and_mark_session', {
      p_review_session_id: payload.reviewSessionId,
      p_belongs_rating: payload.belongsRating,
      p_fair_use_rating: payload.fairUseRating,
      p_appearance_rating: payload.appearanceRating,
      p_tags: payload.tags,
      p_community_feedback: payload.communityFeedback,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting step 2 data:', error);
    return false;
  }
}
