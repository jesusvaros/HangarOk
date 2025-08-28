import type { PublicReview } from '../../services/supabase/publicReviews';
import { Link } from 'react-router-dom';
import OpinionSection from '../review/OpinionSection';
import { ChatBubbleLeftRightIcon, StarIcon as StarIconOutline, MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

type Props = {
  review: PublicReview | null;
  onClose?: () => void;
};

export default function DetailsPanel({ review, onClose }: Props) {
  const wr = typeof review?.would_recommend === 'number' ? review.would_recommend : undefined;
  const headerClass = wr === undefined
    ? 'bg-gray-600'
    : wr > 3
      ? 'bg-green-600'
      : wr < 3
        ? 'bg-red-600'
        : 'bg-gray-600';
  const wouldRecommendStr =
    typeof wr === 'number'
      ? (String(Math.min(5, Math.max(1, wr))) as '1' | '2' | '3' | '4' | '5')
      : undefined;

  // Trim very long opinions for compact panel; full text is in the review page
  const truncate = (text: string | null | undefined, max = 280) => {
    if (!text) return undefined;
    const t = text.trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1).trimEnd() + '…';
  };

  return (
    <div className="flex flex-col max-h-full bg-white">
      {/* Header replaced: show opinions + stars to save space */}
      <div className={`${headerClass} text-white px-4 py-2.5 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
          <h3 className="text-sm font-semibold">Opiniones</h3>
          {review && wouldRecommendStr && (
            <div className="ml-1 flex items-center" aria-label={`Recomendación ${wouldRecommendStr} de 5`}>
              {[1,2,3,4,5].map((i) => (
                <span key={i} className="mr-0.5">
                  {i <= Number(wouldRecommendStr) ? (
                    <StarIconSolid className="h-4 w-4 text-yellow-300" />
                  ) : (
                    <StarIconOutline className="h-4 w-4 text-white/60" />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
        {review && (
          <button
            type="button"
            aria-label="Cerrar detalles"
            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-white/90 hover:text-white hover:bg-white/10"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 overflow-auto space-y-4">
        {review ? (
          <>
            {/* Dirección */}
            {review.full_address && (
              <section>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p
                    className="text-sm text-gray-800 break-words"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                    title={review.full_address}
                  >
                    {review.full_address}
                  </p>
                </div>
              </section>
            )}

            {/* Opiniones (reutiliza estilo de la página de review) */}
            {/* On mobile, cap the visible opinion height to keep the footer link visible */}
            <div className="max-h-[26vh] overflow-auto md:max-h-none md:overflow-visible">
              <OpinionSection
                propertyOpinion={undefined}
                communityOpinion={undefined}
                ownerOpinion={truncate(review.owner_opinion, 200)}
                wouldRecommend={wouldRecommendStr}
                showHeader={false}
              />
            </div>

            {/* Enlace a la ficha completa (sticky en mobile para que siempre se vea) */}
            {review?.id && (
              <div className="sticky bottom-0 left-0 right-0 -mx-4 border-t bg-white/95 px-4 py-3 backdrop-blur md:static md:m-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-0">
                <Link
                  to={`/review/${review.id}`}
                  className="inline-flex items-center gap-1 text-[rgb(74,94,50)] hover:underline"
                >
                  Ver detalles completos
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Selecciona un punto del mapa o un item de la lista.
          </p>
        )}
      </div>
    </div>
  );
}
