import type { PublicReview } from '../../services/supabase/publicReviews';

type Props = {
  review: PublicReview | null;
  onClose?: () => void;
};

export default function DetailsPanel({ review, onClose }: Props) {
  const recommended = (review?.would_recommend ?? 0) >= 4;
  const headerClass = recommended ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="flex flex-col max-h-[70vh]">
      {/* Header colored based on recommendation */}
      <div className={`${headerClass} text-white px-4 py-3 flex items-start justify-between`}>
        <h3 className="text-sm font-semibold">Detalles del piso</h3>
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
      <div className="p-4 overflow-auto space-y-4 bg-white">
        {review ? (
          <>
            {/* Sección: Dirección */}
            {review.full_address && (
              <section>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Dirección
                </h4>
                <p className="mt-1 text-sm text-gray-800 whitespace-normal break-words">
                  {review.full_address}
                </p>
              </section>
            )}

            <hr className="border-t" />

            {/* Sección: Opinión del propietario */}
            {review.owner_opinion && (
              <section>
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Opinión del propietario
                </h4>
                <p className="mt-1 text-sm text-gray-800 whitespace-pre-line break-words">
                  {review.owner_opinion}
                </p>
              </section>
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
