import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}

const selectedIcon = L.divIcon({
  className: '',
  html:
    '<div style="width:22px;height:22px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
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
          const markerProps = isSelected ? { icon: selectedIcon } : {};
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
