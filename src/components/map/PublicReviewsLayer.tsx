import { Marker } from 'react-leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

import { svgToIcon } from './svgIcon';
import { chatBubbleSVG } from './heroPin';


interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
}


// Use hero chat bubble shape as a green pin with white check
const opinionIcon = svgToIcon(
  chatBubbleSVG({ fill: '#22C55E', stroke: 'none', size: 34, includeCheck: true, checkStroke: '#FFFFFF' }),
  [34, 34],
  [17, 34]
);

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
          const markerProps = isSelected ? { icon: opinionIcon } : { icon: opinionIcon };
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
