import { supabaseWrapper } from './client';
import { slugify } from '../../utils/slugify';

export type PublicReview = {
  id: string | number;
  full_address: string | null;
  lat: number | null;
  lng: number | null;
  // Hangar review fields (replacing owner_opinion and would_recommend)
  overall_safety_rating: number | null;  // Average of daytime and nighttime safety
  overall_usability_rating: number | null;  // Average of usability ratings
  uses_hangar: boolean | null;  // true = current user, false = waiting list / nearby rider
  hangar_number: string | null;  // Hangar identifier (e.g., Cyclehangar_2271)
  // Individual ratings
  daytime_safety_rating: number | null;
  nighttime_safety_rating: number | null;
  lock_ease_rating: number | null;
  space_rating: number | null;
  lighting_rating: number | null;
  maintenance_rating: number | null;
  belongs_rating: number | null;
  fair_use_rating: number | null;
  appearance_rating: number | null;
  theft_worry_rating: number | null;
  bike_messed_with: boolean | null;
  current_bike_storage: string | null;
  stops_cycling: string | null;
  impact_tags: string[] | null;
  waitlist_fairness_rating: number | null;
  waitlist_tags: string[] | null;
  connection_type: string | null;
  community_feedback: string | null;
  improvement_suggestion: string | null;
  improvement_feedback: string | null;
  report_ease_rating: number | null;
  fix_speed_rating: number | null;
  communication_rating: number | null;
  home_type: string | null;
  // Tags
  perception_tags: string[] | null;
  safety_tags: string[] | null;
  usability_tags: string[] | null;
  maintenance_tags: string[] | null;
  // Location
  city: string | null;
  city_slug: string | null;
  state: string | null;
  postal_code: string | null;
  street: string | null;
};

export async function getPublicReviews(): Promise<PublicReview[]> {
  const client = supabaseWrapper.getClient();
  if (!client) return [];

  const { data, error} = await client
    .from('public_reviews')
    .select('id, address_details, daytime_safety_rating, nighttime_safety_rating, lock_ease_rating, space_rating, lighting_rating, maintenance_rating, uses_hangar, perception_tags, safety_tags, usability_tags, maintenance_tags, hangar_number, belongs_rating, fair_use_rating, appearance_rating, theft_worry_rating, bike_messed_with, impact_tags, waitlist_fairness_rating, waitlist_tags, improvement_suggestion, report_ease_rating, fix_speed_rating, communication_rating, home_type')
    .eq('is_public', true);

  if (error || !data) return [];

  type AddressCoordinates = {
    lat?: number | string | null;
    lng?: number | string | null;
  } | null;

  type AddressComponents = {
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    road?: string | null;
    country?: string | null;
  } | null;

  type AddressDetails = {
    fullAddress?: string | null;
    coordinates?: AddressCoordinates;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    street?: string | null;
    number?: string | null;
    door?: string | null;
    floor?: string | null;
    components?: AddressComponents;
  } | null;

  type Row = {
    id: string | number;
    address_details?: AddressDetails;
    daytime_safety_rating?: number | null;
    nighttime_safety_rating?: number | null;
    lock_ease_rating?: number | null;
    space_rating?: number | null;
    lighting_rating?: number | null;
    maintenance_rating?: number | null;
    belongs_rating?: number | null;
    fair_use_rating?: number | null;
    appearance_rating?: number | null;
    theft_worry_rating?: number | null;
    bike_messed_with?: boolean | null;
    current_bike_storage?: string | null;
    stops_cycling?: string | null;
    impact_tags?: string[] | null;
    waitlist_fairness_rating?: number | null;
    waitlist_tags?: string[] | null;
    connection_type?: string | null;
    community_feedback?: string | null;
    improvement_suggestion?: string | null;
    improvement_feedback?: string | null;
    report_ease_rating?: number | null;
    fix_speed_rating?: number | null;
    communication_rating?: number | null;
    home_type?: string | null;
    uses_hangar?: boolean | null;
    perception_tags?: string[] | null;
    safety_tags?: string[] | null;
    usability_tags?: string[] | null;
    maintenance_tags?: string[] | null;
    hangar_number?: string | null;
  };

  const rows = data as unknown as Row[];

  const mapped = rows.map(review => {
    const details: AddressDetails = review.address_details ?? null;
    const coords = details?.coordinates ?? null;
    const lat = coords?.lat != null ? Number(coords.lat) : null;
    const lng = coords?.lng != null ? Number(coords.lng) : null;
    const fullAddress = (details?.fullAddress ?? null) as string | null;
    const city =
      typeof details?.city === 'string'
        ? details.city
        : typeof details?.components?.city === 'string'
          ? details.components.city
          : null;
    const state =
      typeof details?.state === 'string'
        ? details.state
        : typeof details?.components?.state === 'string'
          ? details.components.state
          : null;
    const postalCode =
      typeof details?.postalCode === 'string'
        ? details.postalCode
        : typeof details?.components?.postcode === 'string'
          ? details.components.postcode
          : null;
    const street =
      typeof details?.street === 'string'
        ? details.street
        : typeof details?.components?.road === 'string'
          ? details.components.road
          : null;
    const citySlug = city ? slugify(city) : null;
    
    // Calculate average safety rating (daytime + nighttime) / 2
    const safetyRatings = [
      review.daytime_safety_rating,
      review.nighttime_safety_rating
    ].filter((r): r is number => r != null);
    const overallSafetyRating = safetyRatings.length > 0
      ? safetyRatings.reduce((sum, r) => sum + r, 0) / safetyRatings.length
      : null;
    
    // Calculate average usability rating (lock_ease + space + lighting + maintenance) / 4
    const usabilityRatings = [
      review.lock_ease_rating,
      review.space_rating,
      review.lighting_rating,
      review.maintenance_rating
    ].filter((r): r is number => r != null);
    const overallUsabilityRating = usabilityRatings.length > 0
      ? usabilityRatings.reduce((sum, r) => sum + r, 0) / usabilityRatings.length
      : null;

    return {
      id: review.id,
      full_address: fullAddress,
      lat,
      lng,
      overall_safety_rating: overallSafetyRating,
      overall_usability_rating: overallUsabilityRating,
      uses_hangar: review.uses_hangar ?? null,
      hangar_number: review.hangar_number ?? null,
      daytime_safety_rating: review.daytime_safety_rating ?? null,
      nighttime_safety_rating: review.nighttime_safety_rating ?? null,
      lock_ease_rating: review.lock_ease_rating ?? null,
      space_rating: review.space_rating ?? null,
      lighting_rating: review.lighting_rating ?? null,
      maintenance_rating: review.maintenance_rating ?? null,
      belongs_rating: review.belongs_rating ?? null,
      fair_use_rating: review.fair_use_rating ?? null,
      appearance_rating: review.appearance_rating ?? null,
      theft_worry_rating: review.theft_worry_rating ?? null,
      bike_messed_with: typeof review.bike_messed_with === 'boolean' ? review.bike_messed_with : null,
      current_bike_storage: review.current_bike_storage ?? null,
      stops_cycling: review.stops_cycling ?? null,
      impact_tags: review.impact_tags ?? null,
      waitlist_fairness_rating: review.waitlist_fairness_rating ?? null,
      waitlist_tags: review.waitlist_tags ?? null,
      connection_type: review.connection_type ?? null,
      community_feedback: review.community_feedback ?? null,
      improvement_suggestion: review.improvement_suggestion ?? null,
      improvement_feedback: review.improvement_feedback ?? null,
      report_ease_rating: review.report_ease_rating ?? null,
      fix_speed_rating: review.fix_speed_rating ?? null,
      communication_rating: review.communication_rating ?? null,
      home_type: review.home_type ?? null,
      perception_tags: review.perception_tags ?? null,
      safety_tags: review.safety_tags ?? null,
      usability_tags: review.usability_tags ?? null,
      maintenance_tags: review.maintenance_tags ?? null,
      city: city ?? null,
      city_slug: citySlug,
      state: state ?? null,
      postal_code: postalCode ?? null,
      street: street ?? null,
    } satisfies PublicReview;
  });

  // Keep only entries with valid numeric coordinates
  return mapped.filter(
    (r) => typeof r.lat === 'number' && typeof r.lng === 'number'
  ) as PublicReview[];
}
