import L from 'leaflet';

export function svgToIcon(svg: string, size: [number, number], anchor: [number, number]) {
  const svgUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return L.icon({
    iconUrl: svgUrl,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [0, -anchor[1] + 6],
  });
}
