import type { DivIcon } from 'leaflet';
import L from 'leaflet';
import { faceBubbleSVG } from './heroPin';
import { getMood, getFace, type Mood } from '../../utils/ratingHelpers';

type RatingValue = number | null | undefined;
type Variant = 'default' | 'selected';

const COLOR_MAP: Record<Variant, Record<Mood, string>> = {
  default: {
    positive: '#22C55E', // green-500
    negative: '#EF4444', // red-500
    neutral: '#4B5563', // gray-600
  },
  selected: {
    positive: '#15803D', // green-700
    negative: '#B91C1C', // red-700
    neutral: '#374151', // gray-700
  },
};

const DEFAULT_SIZE = 44;

type CreateIconOptions = {
  rating?: RatingValue;
  size?: number;
  variant?: Variant;
  stroke?: string;
};

export const createRatingFaceIcon = ({
  rating = null,
  size = DEFAULT_SIZE,
  variant = 'default',
  stroke = 'none',
}: CreateIconOptions = {}): DivIcon => {
  const mood = getMood(rating);
  const face = getFace(rating);
  const fill = COLOR_MAP[variant][mood];

  return L.divIcon({
    html: faceBubbleSVG({ fill, stroke, size, face }),
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export const ratingFaceHelpers = {
  colors: COLOR_MAP,
};
