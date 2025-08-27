import { supabaseWrapper } from './client';

export type PublicReview = {
  id: string | number;
  full_address: string | null;
  lat: number | null;
  lng: number | null;
  owner_opinion: string | null;
  created_at: string | null;
};

type AddressDetails = {
  fullAddress?: string | null;
  coordinates?: { lat?: number | string | null; lng?: number | string | null } | null;
} | null;

type Row = {
  id: string | number;
  address_details?: AddressDetails;
  owner_opinion?: string | null;
  created_at?: string | null;
};

function mapRows(rows: Row[]): PublicReview[] {
  const mapped = rows.map((review) => {
    const details: AddressDetails = review.address_details ?? null;
    const coords = details?.coordinates ?? null;
    const lat = coords?.lat != null ? Number(coords.lat) : null;
    const lng = coords?.lng != null ? Number(coords.lng) : null;
    const fullAddress = (details?.fullAddress ?? null) as string | null;
    return {
      id: review.id,
      full_address: fullAddress,
      lat,
      lng,
      owner_opinion: review.owner_opinion ?? null,
      created_at: review.created_at ?? null,
    } satisfies PublicReview;
  });

  return mapped.filter((r): r is PublicReview & { lat: number; lng: number } =>
    typeof r.lat === 'number' && typeof r.lng === 'number'
  );
}

export async function getPublicReviews(): Promise<PublicReview[]> {
  const client = supabaseWrapper.getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('public_reviews')
    .select('id, address_details, owner_opinion, created_at')
    .eq('is_public', true);

  if (error || !data) return [];

  return mapRows(data as unknown as Row[]);
}

export async function getLatestPublicReviews(limit = 5): Promise<PublicReview[]> {
  const client = supabaseWrapper.getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('public_reviews')
    .select('id, address_details, owner_opinion, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return mapRows(data as unknown as Row[]);
}
