import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-leaflet';

// Adds a MapLibre vector tiles layer (OpenFreeMap 'liberty' style) into a Leaflet map
export default function MapLibreLayer() {
  const map = useMap();

  useEffect(() => {
    // @ts-ignore - plugin extends L with maplibreGL
    const glLayer = (window as any).L.maplibreGL({
      style: 'https://tiles.openfreemap.org/styles/liberty',
    }).addTo(map);

    return () => {
      try {
        // @ts-ignore
        map.removeLayer(glLayer);
      } catch {
        /* noop */
      }
    };
  }, [map]);

  return null;
}

