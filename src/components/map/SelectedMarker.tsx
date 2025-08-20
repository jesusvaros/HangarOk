import { Marker, Popup } from 'react-leaflet';

type Props = {
  selected: { lat: number; lng: number; address: string } | null;
};

export default function SelectedMarker({ selected }: Props) {
  if (!selected) return null;
  return (
    <Marker position={[selected.lat, selected.lng]}>
      <Popup>
        <div>
          <p className="font-semibold">Dirección seleccionada</p>
          <p>{selected.address}</p>
        </div>
      </Popup>
    </Marker>
  );
}
