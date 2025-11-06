import { Marker } from 'react-leaflet';
import type { PublicReview } from '../../services/supabase/publicReviews';

import { createRatingFaceIcon } from './ratingFaceIcon';

interface Props {
  reviews: PublicReview[];
  selectedId?: string | number | null;
  onSelect?: (review: PublicReview) => void;
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
          let ratingValue: number | undefined;
          if (r.uses_hangar === false) {
            ratingValue = typeof r.waitlist_fairness_rating === 'number' ? r.waitlist_fairness_rating : undefined;
          } else {
            ratingValue = typeof r.overall_safety_rating === 'number'
              ? r.overall_safety_rating
              : typeof r.theft_worry_rating === 'number'
                ? r.theft_worry_rating
                : undefined;
          }
          if (ratingValue === undefined && typeof r.waitlist_fairness_rating === 'number') {
            ratingValue = r.waitlist_fairness_rating;
          }
          const size = isSelected ? 52 : 42;
          const icon = createRatingFaceIcon({
            rating: ratingValue,
            size,
            variant: isSelected ? 'selected' : 'default',
          });
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
