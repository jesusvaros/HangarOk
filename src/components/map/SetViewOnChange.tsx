import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

type Props = {
  center: [number, number];
  zoom: number;
  animate?: boolean;
};

export default function SetViewOnChange({ center, zoom, animate = true }: Props) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom, animate]);

  return null;
}
