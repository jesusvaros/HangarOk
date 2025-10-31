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
    .select('id, address_details, daytime_safety_rating, nighttime_safety_rating, lock_ease_rating, space_rating, lighting_rating, maintenance_rating')
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
      city: city ?? null,
      city_slug: citySlug,
      state: state ?? null,
      postal_code: postalCode ?? null,
      street: street ?? null,
    } satisfies PublicReview;
  });

  // Keep only entries with valid numeric coordinates
  return mapped.filter(
    (r): r is PublicReview & { lat: number; lng: number } =>
      typeof r.lat === 'number' && typeof r.lng === 'number'
  );
}
