import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { LockOpenIcon } from '@heroicons/react/24/outline';
import { createRatingFaceIcon } from './ratingFaceIcon';

type ComboIconOptions = {
  rating?: number | null;
  size?: number;
  variant?: 'default' | 'selected';
};

export function createRatingFaceIconWithTheft({
  rating = null,
  size = 42,
  variant = 'default',
}: ComboIconOptions): L.DivIcon {
  const baseIcon = createRatingFaceIcon({ rating, size, variant });
  const baseHtml = (baseIcon.options as L.DivIconOptions).html ?? '';

  const theftBadgeHtml = ReactDOMServer.renderToString(
    <div
      style={{
        position: 'absolute',
        right: '-1px',
        top: '-1px',
        width: size * 0.48,
        height: size * 0.48,
        borderRadius: '9999px',
        backgroundColor: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <LockOpenIcon
        style={{
          width: '55%',
          height: '55%',
          color: '#FFFFFF',
          stroke: '#FFFFFF',
          strokeWidth: 4,
        }}
      />
    </div>
  );

  const combinedHtml = `
    <div style="position: relative; width: ${size}px; height: ${size}px;">
      ${baseHtml}
      ${theftBadgeHtml}
    </div>
  `;

  return L.divIcon({
    html: combinedHtml,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}
