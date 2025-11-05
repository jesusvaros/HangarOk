import React, { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, HomeModernIcon, ShareIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step3Data } from './reviewStepTypes';
import { ACCENT, average, formatAddress, formatOptionLabel, HOME_TYPE_LABELS, CONNECTION_TYPE_LABELS } from './reviewFormatting';
import { svgToIcon } from '../map/svgIcon';
import { faceBubbleSVG } from '../map/heroPin';

type ReviewInfoSidebarProps = {
  step1Data: AddressStepData | null;
  step3Data: Step3Data | null;
  usesHangar: boolean;
};

const InfoField = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 rounded-xl px-1.5 py-1.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(74,94,50,0.12)', color: ACCENT }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const ReviewInfoSidebar: React.FC<ReviewInfoSidebarProps> = ({
  step1Data,
  step3Data,
  usesHangar,
}) => {
  const coordinates = step1Data?.hangar_location?.coordinates;
  const latRaw = coordinates?.lat;
  const lngRaw = coordinates?.lng;
  const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw;
  const lng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw;
  const position: [number, number] | null =
    typeof lat === 'number' && !Number.isNaN(lat) && typeof lng === 'number' && !Number.isNaN(lng) ? [lat, lng] : null;

  const isBrowser = typeof window !== 'undefined';
  const safetyAverage = average([
    step3Data?.daytime_safety_rating ?? null,
    step3Data?.nighttime_safety_rating ?? null,
  ]);
  const markerIcon = useMemo(() => {
    if (!isBrowser) return null;
    const rating = typeof safetyAverage === 'number' ? safetyAverage : null;
    const color =
      rating == null
        ? '#4B5563'
        : rating > 3
          ? '#22C55E'
          : rating < 3
            ? '#EF4444'
            : '#4B5563';
    const rounded = rating == null ? 3 : Math.round(rating);
    const face = rounded <= 2 ? 'sad' : rounded === 3 ? 'neutral' : 'happy';
    const size = 44;
    return svgToIcon(faceBubbleSVG({ fill: color, stroke: 'none', size, face }), [size, size], [size / 2, size]);
  }, [isBrowser, safetyAverage]);

  const homeTypeLabel = formatOptionLabel(step1Data?.home_type) ?? HOME_TYPE_LABELS[step1Data?.home_type ?? ''] ?? null;
  const connectionLabel = formatOptionLabel(step1Data?.connection_type) ?? CONNECTION_TYPE_LABELS[step1Data?.connection_type ?? ''] ?? null;
  const usageLabel = usesHangar ? 'Uses the hangar regularly' : 'Does not currently rent a space';
  const headerCaption = usesHangar ? 'Current hangar rider review' : 'Local rider / waiting list perspective';
  const hangarNumber = step1Data?.hangar_number ?? null;

  return (
    <aside className="mb-6 space-y-4 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1F56E]/30 text-[#3B4C28]">
            <MapPinIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{headerCaption}</p>
              <div className="mt-1 flex flex-col gap-1">
              <span className="text-lg font-semibold text-gray-900 leading-tight">{formatAddress(step1Data)}</span>
              {hangarNumber && <span className="text-sm font-semibold text-[#4A5E32]">Hangar {hangarNumber}</span>}
             
            </div>
          </div>
        </div>
        <div className="mt-4">
          {position && isBrowser && markerIcon ? (
            <MapContainer
              key={position.join(',')}
              center={position}
              zoom={16}
              scrollWheelZoom={false}
              dragging
              style={{ height: '220px', width: '100%', borderRadius: '18px' }}
              className="overflow-hidden shadow-sm"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position} icon={markerIcon} />
            </MapContainer>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-500">
              We could not plot this hangar on the map.
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          <InfoField icon={<MapPinIcon className="h-5 w-5" />} label="Hangar number" value={hangarNumber} />
          <InfoField icon={<HomeModernIcon className="h-5 w-5" />} label="Home type" value={homeTypeLabel} />
          <InfoField icon={<ShareIcon className="h-5 w-5" />} label="Connection to hangar" value={connectionLabel} />
          <InfoField icon={<UserGroupIcon className="h-5 w-5" />} label="Usage" value={usageLabel} />
        </div>
      </div>
    </aside>
  );
};

export default ReviewInfoSidebar;
