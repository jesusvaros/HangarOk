import React from 'react';

interface SegmentedBarProps {
  value: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
}

/**
 * Segmented horizontal bar with 5 blocks
 * Shows a visual rating with filled segments and numeric value
 */
export const SegmentedBar: React.FC<SegmentedBarProps> = ({
  value,
  maxValue = 5,
  color = 'rgb(74,94,50)',
  showValue = true,
}) => {
  const segments = 5;
  const filledSegments = Math.round((value / maxValue) * segments);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 flex-1">
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            className="h-2 flex-1 rounded-sm transition-all duration-300"
            style={{
              backgroundColor: index < filledSegments ? color : '#E5E7EB',
            }}
          />
        ))}
      </div>
      {showValue && (
        <span
          className="text-xs font-bold min-w-[2.5rem] text-right"
          style={{ color }}
        >
          {value.toFixed(1)} / {maxValue}
        </span>
      )}
    </div>
  );
};
