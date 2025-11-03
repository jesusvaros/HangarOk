import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/outline';

export type ReviewListItem = {
  id: string | number;
  lat?: number;
  lng?: number;
  would_recommend?: number;
  usability_rating?: number;
  texto?: string;
  comment?: string;
  uses_hangar?: boolean | null;
  hangar_number?: string | null;
};

const getRatingLabel = (score: number): string => {
  if (score >= 4.8) return 'Excellent';
  if (score >= 4.3) return 'Excellent';
  if (score >= 3.8) return 'Great';
  if (score >= 2.8) return 'Average';
  if (score >= 1.8) return 'Poor';
  return 'Bad';
};

const getStarCount = (score: number): number => {
  if (score >= 4.8) return 5;
  if (score >= 4.3) return 4.5;
  if (score >= 3.8) return 4;
  if (score >= 2.8) return 3;
  if (score >= 1.8) return 2;
  return 1;
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
    <div className="h-full min-h-0 flex flex-col p-1">
      {reviews.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <div className="text-2xl">😞</div>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              No reviews in this area yet
            </p>
          </div>
        </div>
      ) : (
        <>
          <ul className="space-y-2 flex-1 overflow-auto p-1 ">  
            {reviews.map(r => {
              const id = r.id ?? `${r.lat}-${r.lng}`;
              const address = r.texto ?? '-';
              const score = r.would_recommend ?? 0;
              const hasRating = score > 0;
              const starCount = hasRating ? getStarCount(score) : 0;
              const label = hasRating ? getRatingLabel(score) : 'No rating yet';
              const headerClass = definecolor(score);
              const isSelected = String(selectedId ?? '') === String(id);
              const isCurrentUser = r.uses_hangar === true;
              const UserIcon = isCurrentUser ? CheckBadgeIcon : ClockIcon;
              
              return (
                <li
                  key={id}
                  onMouseEnter={() => setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onSelect(r)}
                  className={`cursor-pointer rounded-lg overflow-hidden border bg-white transition ${hoveredId === id ? 'ring-2 ring-amber-300 shadow-md' : 'shadow-sm'} ${isSelected ? 'ring-2 ring-green-600 bg-emerald-50' : ''}`}
                >
                  {/* Header with hangar number and user status - different colors */}
                  <div className={`px-3 py-2 border-b flex items-center justify-between ${isCurrentUser ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex items-center gap-2">
                      <UserIcon className={`h-4 w-4 ${isCurrentUser ? 'text-green-700' : 'text-orange-600'}`} />
                      <span className={`text-xs font-bold uppercase tracking-wide ${isCurrentUser ? 'text-green-800' : 'text-orange-700'}`}>
                        {r.hangar_number || 'Hangar'}
                      </span>
                    </div>
                    {hasRating && (
                      <div className={`px-2 py-0.5 rounded text-xs font-bold ${headerClass} text-white`}>
                        {label}
                      </div>
                    )}
                  </div>
                  
                  {/* Body */}
                  <div className="px-3 py-3">
                    {/* Address - smaller and gray */}
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {address}
                    </p>
                    
                    {/* Rating with stars */}
                    {hasRating ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-600">Safety</span>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => {
                              const isFull = i <= Math.floor(starCount);
                              const isHalf = !isFull && i === Math.ceil(starCount) && starCount % 1 !== 0;
                              return (
                                <span key={i}>
                                  {isFull ? (
                                    <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                                  ) : isHalf ? (
                                    <div className="relative">
                                      <StarIconOutline className="h-3.5 w-3.5 text-yellow-400" />
                                      <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                        <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                                      </div>
                                    </div>
                                  ) : (
                                    <StarIconOutline className="h-3.5 w-3.5 text-gray-300" />
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        {r.usability_rating && r.usability_rating > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">Usability</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => {
                                const usabilityStarCount = getStarCount(r.usability_rating!);
                                const isFull = i <= Math.floor(usabilityStarCount);
                                const isHalf = !isFull && i === Math.ceil(usabilityStarCount) && usabilityStarCount % 1 !== 0;
                                return (
                                  <span key={i}>
                                    {isFull ? (
                                      <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                                    ) : isHalf ? (
                                      <div className="relative">
                                        <StarIconOutline className="h-3.5 w-3.5 text-yellow-400" />
                                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                          <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
                                        </div>
                                      </div>
                                    ) : (
                                      <StarIconOutline className="h-3.5 w-3.5 text-gray-300" />
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">{label}</p>
                    )}
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
