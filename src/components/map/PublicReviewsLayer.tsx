import { Marker } from 'react-leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

import { svgToIcon } from './svgIcon';
import { faceBubbleSVG } from './heroPin';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}

// Helper to create icons based on would_recommend and recommendation
function buildIcon(color: string, size: number, would_recommend: number) {
  const face = would_recommend <= 2 ? 'sad' : would_recommend === 3 ? 'neutral' : 'happy';
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
          const wr = typeof r.overall_safety_rating === 'number'
            ? r.overall_safety_rating
            : typeof r.theft_worry_rating === 'number'
              ? r.theft_worry_rating
              : typeof r.waitlist_fairness_rating === 'number'
                ? r.waitlist_fairness_rating
                : undefined;
          const color = wr === undefined
            ? '#4B5563' // gray-600
            : wr > 3
              ? '#22C55E' // green-500
              : wr < 3
                ? '#EF4444' // red-500
                : '#4B5563'; // gray-600
          const selectedColor = wr === undefined
            ? '#374151' // gray-700
            : wr > 3
              ? '#15803D' // green-700
              : wr < 3
                ? '#B91C1C' // red-700
                : '#374151'; // gray-700
          const size = isSelected ? 52 : 42;
          const would_recommend = typeof wr === 'number' ? wr : 3;
          const icon = buildIcon(isSelected ? selectedColor : color, size, would_recommend);
          const zIndexOffset = isSelected ? 1200 : 400; // keep selected above others

          return (
            <Marker
              key={`public-${r.id}`}
              position={[r.lat as number, r.lng as number]}
              icon={icon}
              eventHandlers={{
                click: () => onSelect?.(r),
              }}
              riseOnHover
              zIndexOffset={zIndexOffset}
            />
          );
        })}
    </>
  );
}
