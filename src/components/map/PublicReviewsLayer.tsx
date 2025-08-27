import { Marker } from 'react-leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

import { svgToIcon } from './svgIcon';
import { faceBubbleSVG } from './heroPin';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}

// Helper to create icons based on rating and recommendation
function buildIcon(color: string, size: number, rating: number) {
  const face = rating <= 2 ? 'sad' : rating === 3 ? 'neutral' : 'happy';
  return svgToIcon(
    faceBubbleSVG({ fill: color, stroke: 'none', size, face }),
    [size, size],
    [size / 2, size]
  );
}

export default function PublicReviewsLayer({ reviews, selectedId, onSelect }: Props) {
  if (!reviews?.length) return null;

  return (
    <>
      {reviews
        .filter(
          (r): r is Required<Pick<PublicReview, 'id' | 'lat' | 'lng'>> & PublicReview =>
            typeof r.id !== 'undefined' && typeof r.lat === 'number' && typeof r.lng === 'number'
        )
        .map(r => {
          const isSelected = String(r.id) === String(selectedId ?? '');
          const recommended = (r.would_recommend ?? 0) >= 1;
          const color = recommended ? '#22C55E' : '#EF4444'; // green-500 / red-500
          const selectedColor = recommended ? '#15803D' : '#B91C1C'; // darker when selected
          const size = isSelected ? 52 : 42;
          const rating = r.rating ?? 3;
          const icon = buildIcon(isSelected ? selectedColor : color, size, rating);

          return (
            <Marker
              key={`public-${r.id}`}
              position={[r.lat as number, r.lng as number]}
              icon={icon}
              eventHandlers={{
                click: () => onSelect?.(r),
              }}
              riseOnHover
            />
          );
        })}
    </>
  );
}
