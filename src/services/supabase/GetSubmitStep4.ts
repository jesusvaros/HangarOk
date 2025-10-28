import { supabaseWrapper } from './client';

interface HangarStep4Data {
  lock_ease_rating: number | null;
  space_rating: number | null;
  lighting_rating: number | null;
  maintenance_rating: number | null;
  usability_tags: string[];
  improvement_suggestion: string | null;
  stops_cycling: string | null;
  impact_tags: string[];
}

export async function getHangarStep4Data(reviewSessionId: string): Promise<HangarStep4Data | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client.rpc('get_hangar_step4_data', {
      p_review_session_id: reviewSessionId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching step 4 data:', error);
    return null;
  }
}

export async function submitHangarStep4(payload: {
  reviewSessionId: string;
  lockEaseRating: number | null | undefined;
  spaceRating: number | null | undefined;
  lightingRating: number | null | undefined;
  maintenanceRating: number | null | undefined;
  usabilityTags: string[];
  improvementSuggestion: string | null;
  stopsCycling: string | null | undefined;
  impactTags: string[];
}): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client.rpc('upsert_hangar_step4_and_mark_session', {
      p_review_session_id: payload.reviewSessionId,
      p_lock_ease_rating: payload.lockEaseRating ?? null,
      p_space_rating: payload.spaceRating ?? null,
      p_lighting_rating: payload.lightingRating ?? null,
      p_maintenance_rating: payload.maintenanceRating ?? null,
      p_usability_tags: payload.usabilityTags,
      p_improvement_suggestion: payload.improvementSuggestion,
      p_stops_cycling: payload.stopsCycling ?? null,
      p_impact_tags: payload.impactTags,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting step 4 data:', error);
    return false;
  }
}
