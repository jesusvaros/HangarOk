import { Marker, Popup } from 'react-leaflet';
import type { Opinion } from '../../supabaseClient';

interface Props {
  opinions: Opinion[];
}

export default function OpinionsLayer({ opinions }: Props) {
  return (
    <>
      {opinions.map((op) => {
        const lat = op.lat ?? 0;
        const lng = op.lng ?? 0;
        return (
          <Marker key={op.id} position={[lat, lng]}>
            <Popup>
              <div>
                <p className="font-semibold">Rating: {op.rating}/5</p>
                {op.texto && <p>{op.texto}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
