import type { PublicReview } from '../../services/supabase/publicReviews';
import { Link } from 'react-router-dom';
import OpinionSection from '../review/OpinionSection';

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
    <div className="flex flex-col max-h-[70vh] bg-white">
      {/* Header */}
      <div className={`${headerClass} text-white px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <h3 className="text-sm font-semibold">Detalles del piso</h3>
          {review && (
            <span className="ml-2 inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">
              {wr === undefined ? 'Sin valoración' : wr > 3 ? 'Recomendado' : wr < 3 ? 'No recomendado' : 'Neutral'}
            </span>
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
              <section className="space-y-1">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Dirección
                </h4>
                <p className="text-sm text-gray-800 whitespace-normal break-words">
                  {review.full_address}
                </p>
              </section>
            )}

            {/* Opiniones (reutiliza estilo de la página de review) */}
            <OpinionSection
              propertyOpinion={undefined}
              communityOpinion={undefined}
              ownerOpinion={truncate(review.owner_opinion)}
              wouldRecommend={wouldRecommendStr}
            />

            {/* Enlace a la ficha completa */}
            {review?.id && (
              <div className="pt-2">
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
