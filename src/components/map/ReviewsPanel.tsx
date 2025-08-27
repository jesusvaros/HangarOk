import React from 'react';

export type ReviewListItem = {
  id: string | number;
  lat?: number;
  lng?: number;
  would_recommend?: number;
  texto?: string;
  comment?: string;
};

interface ReviewsPanelProps {
  reviews: ReviewListItem[];
  hoveredId: string | number | null;
  setHoveredId: (id: string | number | null) => void;
  onSelect: (r: ReviewListItem) => void;
  selectedId?: string | number | null;
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
  reviews,
  hoveredId,
  setHoveredId,
  onSelect,
  selectedId,
}) => {
  console.log(reviews);

  const definecolor = (recommendation: number) => {
    if (!recommendation) {
      return 'bg-gray-600';
    }
    if (recommendation > 3) {
      return 'bg-green-600';
    } 
    if (recommendation < 3 ) {
      return 'bg-red-600';
    }
    return 'bg-gray-600';
  };

  

  return (
    <div className="h-full flex flex-col p-1">
      {reviews.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <div className="text-2xl">😞</div>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              Aún no hay opiniones en esta zona
            </p>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-2 pr-1 flex-1">  
            {reviews.map(r => {
              const id = r.id ?? `${r.lat}-${r.lng}`;
              const address = r.texto ?? '—';
              const opinion = r.comment ?? 'Sin comentario';
              const headerClass = definecolor(r.would_recommend ?? 0);
              const isSelected = String(selectedId ?? '') === String(id);
              return (
                <li
                  key={id}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelect(r)}
                  className={`cursor-pointer rounded-xl overflow-hidden border transition ${hoveredId === id ? 'ring-1 ring-amber-200' : ''} ${isSelected ? 'ring-2 ring-green-600 bg-emerald-50' : ''}`}
                >
                  {/* Header */}
                  <div
                    className={`${headerClass} text-white px-3 py-2 text-sm font-semibold flex items-center justify-between`}
                  >
                  </div>
                  {/* Body */}
                  <div className="px-3 py-3 bg-white">
                    <p className="text-gray-800 text-sm md:text-base whitespace-normal break-words">
                      {address}
                    </p>
                    <hr className="my-3 border-t" />
                    <p className="text-gray-700 text-sm whitespace-pre-line break-words max-h-[100px] overflow-y-auto">
                      {opinion}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReviewsPanel;
