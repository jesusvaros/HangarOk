import { supabaseWrapper } from './supabase/client';

export type SiteStats = {
  totalReviews: number;
  verifiedLandlords: number;
  cities: number;
};

export async function fetchSiteStats(): Promise<SiteStats> {
  const client = supabaseWrapper.getClient();
  try {
    if (!client) {
      // Return mock data when Supabase client is not available
      return {
        totalReviews: 0,
        verifiedLandlords: 0,
        cities: 0,
      };
    }

    const { count } = await client
      .from('public_reviews')
      .select('*', { count: 'exact', head: true });

    // Additional stats can be fetched here from other tables
    return {
      totalReviews: count ?? 0,
      verifiedLandlords: 0,
      cities: 0,
    };
  } catch {
    // Fallback to mock data on any error
    return {
      totalReviews: 0,
      verifiedLandlords: 0,
      cities: 0,
    };
  }
}
