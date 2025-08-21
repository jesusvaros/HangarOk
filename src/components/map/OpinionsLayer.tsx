import { Marker } from 'react-leaflet';
import type { Opinion } from '../../supabaseClient';
import { svgToIcon } from './svgIcon';
import { chatBubbleSVG } from './heroPin';

interface Props {
  opinions: Opinion[];
}

// Use hero chat bubble shape as a green pin with white check
const opinionIcon = svgToIcon(
  chatBubbleSVG({ fill: '#22C55E', stroke: 'none', size: 34, includeCheck: true, checkStroke: '#FFFFFF' }),
  [34, 34],
  [17, 34]
);

export default function OpinionsLayer({ opinions }: Props) {
  return (
    <>
      {opinions.map((op) => {
        const lat = op.lat ?? 0;
        const lng = op.lng ?? 0;
        return (
          <Marker
            key={op.id}
            position={[lat, lng]}
            icon={opinionIcon}
            riseOnHover
            zIndexOffset={250}
          />
        );
      })}
    </>
  );
}
