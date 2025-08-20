import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export type LatLngItem = { lat: number | null; lng: number | null };

interface Props<T extends LatLngItem> {
  items: T[];
  onChange: (visible: T[]) => void;
}

export default function MapBoundsWatcher<T extends LatLngItem>({ items, onChange }: Props<T>) {
  const map = useMap();
  const lastIdsRef = useRef<string>(""
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVisible = () => {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const visible = items.filter((r) => {
        const lat = typeof r.lat === 'number' ? r.lat : NaN;
        const lng = typeof r.lng === 'number' ? r.lng : NaN;
        return (
          !Number.isNaN(lat) &&
          !Number.isNaN(lng) &&
          lat >= sw.lat &&
          lat <= ne.lat &&
          lng >= sw.lng &&
          lng <= ne.lng
        );
      });
      // shallow equality by id list to avoid redundant state updates
      const ids = visible.map((v, idx) => (v as unknown as { id?: string | number }).id ?? idx).join(',');
      if (ids !== lastIdsRef.current) {
        lastIdsRef.current = ids;
        onChange(visible);
      }
    };

    const schedule = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(updateVisible, 180);
    };

    // initial and on moveend (debounced)
    updateVisible();
    map.on('moveend', schedule);
    return () => {
      map.off('moveend', schedule);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [map, items, onChange]);

  return null;
}
