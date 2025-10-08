import { supabaseWrapper } from './client';
import { slugify } from '../../utils/slugify';

export type PublicReview = {
  id: string | number;
  full_address: string | null;
  lat: number | null;
  lng: number | null;
  owner_opinion: string | null;
  would_recommend: number | null;
  city: string | null;
  city_slug: string | null;
  state: string | null;
  postal_code: string | null;
  street: string | null;
};

export async function getPublicReviews(): Promise<PublicReview[]> {
  const client = supabaseWrapper.getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('public_reviews')
    .select('id, address_details, owner_opinion, would_recommend')
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
    owner_opinion?: string | null;
    would_recommend?: number | string | null;
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
    const wouldRecommend =
      review.would_recommend != null ? Number(review.would_recommend) : null;

    return {
      id: review.id,
      full_address: fullAddress,
      lat,
      lng,
      owner_opinion: review.owner_opinion ?? null,
      would_recommend: wouldRecommend,
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
