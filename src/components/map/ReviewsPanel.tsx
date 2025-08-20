import React from 'react';

export type ReviewListItem = {
  id: string | number;
  lat?: number;
  lng?: number;
  rating?: number;
  texto?: string;
  comment?: string;
  created_at?: string;
};

interface ReviewsPanelProps {
  reviews: ReviewListItem[];
  hoveredId: string | number | null;
  setHoveredId: (id: string | number | null) => void;
  onSelect: (r: ReviewListItem) => void;
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({ reviews, hoveredId, setHoveredId, onSelect }) => {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Opiniones ({reviews.length})</h2>
        {/* TODO: filtros / orden */}
      </div>
      <ul className="space-y-2 max-h-[78vh] overflow-auto pr-1">
        {reviews.map((r) => {
          const id = r.id ?? `${r.lat}-${r.lng}`;
          const rating = typeof r.rating === 'number' ? r.rating : '—';
          const texto = r.texto ?? r.comment ?? 'Sin comentario';
          const createdAt = r.created_at ? new Date(r.created_at).toLocaleDateString() : '';
          return (
            <li
              key={id}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelect(r)}
              className={`cursor-pointer rounded-xl p-3 border transition ${hoveredId === id ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-white hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                  {rating}
                </span>
                <p className="truncate text-sm text-gray-700">{texto}</p>
              </div>
              <div className="mt-1 text-xs text-gray-500">{createdAt}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReviewsPanel;
