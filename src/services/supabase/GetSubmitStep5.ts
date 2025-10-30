import { supabaseWrapper } from './client';

interface HangarStep5Data {
  report_ease_rating: number | null;
  fix_speed_rating: number | null;
  communication_rating: number | null;
  maintenance_tags: string[];
  waitlist_fairness_rating: number | null;
  waitlist_tags: string[];
  improvement_feedback: string | null;
}

export async function getHangarStep5Data(reviewSessionId: string): Promise<HangarStep5Data | null> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { data, error } = await client.rpc('get_hangar_step5_data', {
      p_review_session_id: reviewSessionId,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching step 5 data:', error);
    return null;
  }
}

export async function submitHangarStep5(payload: {
  reviewSessionId: string;
  reportEaseRating: number | null | undefined;
  fixSpeedRating: number | null | undefined;
  communicationRating: number | null | undefined;
  maintenanceTags: string[];
  waitlistFairnessRating: number | null | undefined;
  waitlistTags: string[];
  improvementFeedback: string | null;
}): Promise<boolean> {
  try {
    const client = supabaseWrapper.getClient();
    if (!client) throw new Error('Supabase client not available');

    const { error } = await client.rpc('upsert_hangar_step5_and_mark_session', {
      p_review_session_id: payload.reviewSessionId,
      p_report_ease_rating: payload.reportEaseRating ?? null,
      p_fix_speed_rating: payload.fixSpeedRating ?? null,
      p_communication_rating: payload.communicationRating ?? null,
      p_maintenance_tags: payload.maintenanceTags,
      p_waitlist_fairness_rating: payload.waitlistFairnessRating ?? null,
      p_waitlist_tags: payload.waitlistTags,
      p_improvement_feedback: payload.improvementFeedback,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting step 5 data:', error);
    return false;
  }
}
