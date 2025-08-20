import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface RecenterOnSelectProps {
  coords: { lat: number; lng: number } | null;
}

export const RecenterOnSelect: React.FC<RecenterOnSelectProps> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      const targetZoom = Math.max(map.getZoom(), 16);
      map.flyTo([coords.lat, coords.lng], targetZoom, { animate: true, duration: 0.8 });
    }
  }, [coords, map]);
  return null;
};
