import React, { useState } from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface StarRatingProps {
  label: string;
  value: 1 | 2 | 3 | 4 | 5 | undefined;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
  error?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ label, value = 0, onChange, error }) => {
  const [hoverValue, setHoverValue] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  const handleClick = (rating: 1 | 2 | 3 | 4 | 5) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating: 1 | 2 | 3 | 4 | 5) => {
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="space-y-2">
      <label className="block text-lg font-medium text-black">
        {label}
      </label>
      <div className="flex items-center">
        {([1, 2, 3, 4, 5] as const).map((star) => {
          const isSelected = displayValue >= star;

          return (
            <div key={star} className="relative inline-block -mr-1">
              {/* Full star clickable area */}
              <button
                type="button"
                onClick={() => handleClick(star)}
                onMouseEnter={() => handleMouseEnter(star)}
                onMouseLeave={handleMouseLeave}
                className="relative w-8 h-8 cursor-pointer focus:outline-none"
                aria-label={`${star} stars`}
              >
                {/* Star visual */}
                {isSelected ? (
                  <StarIconSolid className="w-8 h-8 text-yellow-500" />
                ) : (
                  <StarIconOutline className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>
          );
        })}
        <span className="ml-4 text-lg text-gray-600 font-semibold whitespace-nowrap w-12">
          {displayValue > 0 ? <div className="flex items-center"> <span className="flex max-w-4 w-4 min-w-4">{displayValue}</span> / 5 </div>  : ''}
        </span>
      </div>
      {error && (
        <p className="text-sm text-red-500">Please select a rating</p>
      )}
    </div>
  );
};

export default StarRating;
