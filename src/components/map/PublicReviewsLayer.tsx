import { Marker } from 'react-leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

import { svgToIcon } from './svgIcon';
import { chatBubbleSVG } from './heroPin';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}

// Helper to create colored icons depending on recommendation and selection
function buildIcon(color: string, size: number, includeCheck = false) {
  return svgToIcon(
    chatBubbleSVG({ fill: color, stroke: 'none', size, includeCheck, checkStroke: '#FFFFFF' }),
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
          const recommended = (r.would_recommend ?? 0) >= 4;
          const color = recommended ? '#22C55E' : '#EF4444'; // green-500 / red-500
          const selectedColor = recommended ? '#15803D' : '#B91C1C'; // darker when selected
          const size = isSelected ? 52 : 42;
          const icon = buildIcon(isSelected ? selectedColor : color, size, recommended);

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
