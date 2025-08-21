import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}

const defaultIcon = L.divIcon({
  className: '',
  html: `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
  <circle cx="15" cy="15" r="13" fill="#22C55E" />
  <path d="M9.5 15.5l3.5 3.5 7-7" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M15 30 L22 40 L8 40 Z" fill="#22C55E" />
</svg>
`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const selectedIcon = L.divIcon({
  className: '',
  html: `
<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
  <circle cx="18" cy="18" r="15" fill="#22C55E" />
  <path d="M11 18l4.2 4.2 8.4-8.4" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M18 34 L26 46 L10 46 Z" fill="#22C55E" />
</svg>
`,
  iconSize: [36, 46],
  iconAnchor: [18, 46],
});

export default function PublicReviewsLayer({ reviews, selectedId, onSelect }: Props) {
  if (!reviews?.length) return null;

  return (
    <>
      {reviews
        .filter((r): r is Required<Pick<PublicReview, 'id' | 'lat' | 'lng'>> & PublicReview =>
          typeof r.id !== 'undefined' && typeof r.lat === 'number' && typeof r.lng === 'number'
        )
        .map((r) => {
          const isSelected = String(r.id) === String(selectedId ?? '');
          const markerProps = isSelected ? { icon: selectedIcon } : { icon: defaultIcon };
          return (
            <Marker
              key={`public-${r.id}`}
              position={[r.lat as number, r.lng as number]}
              {...markerProps}
              eventHandlers={{
                click: () => onSelect?.(r),
              }}
              riseOnHover
            >
            </Marker>
          );
        })}
    </>
  );
}
