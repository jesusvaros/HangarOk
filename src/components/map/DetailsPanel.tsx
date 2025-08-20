import type { PublicReview } from '../../services/supabase/publicReviews';

type Props = {
  review: PublicReview | null;
  onClose?: () => void;
};

export default function DetailsPanel({ review, onClose }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-h-[70vh] overflow-auto">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Detalles del piso</h3>
        {review && (
          <button
            type="button"
            aria-label="Cerrar detalles"
            className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            ✕
          </button>
        )}
      </div>
      {review ? (
        <div className="space-y-2">
          {review.full_address && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Dirección: </span>
              {review.full_address}
            </p>
          )}
          {review.owner_opinion && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Opinión del propietario</p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{review.owner_opinion}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Selecciona un punto del mapa o un item de la lista.</p>
      )}
    </div>
  );
}
