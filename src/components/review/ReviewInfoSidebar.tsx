import React, { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon, ShareIcon, UserGroupIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import { ACCENT, formatAddress, formatOptionLabel, CONNECTION_TYPE_LABELS, formatOpenToSwap } from './reviewFormatting';
import { createRatingFaceIcon } from '../map/ratingFaceIcon';
import { calculateSecurityRating, calculateHangarOKScore } from '../../utils/ratingHelpers';

type ReviewInfoSidebarProps = {
  step1Data: AddressStepData | null;
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
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
  step2Data,
  step3Data,
  step4Data,
  step5Data,
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
  
  // Calculate HangarOK Score for hangar users
  const communityRatings = [step2Data?.belongs_rating, step2Data?.fair_use_rating, step2Data?.appearance_rating].filter((r): r is number => r !== null);
  const communityVibe = communityRatings.length > 0 ? communityRatings.reduce((sum, r) => sum + r, 0) / communityRatings.length : null;
  
  const securityRating = usesHangar 
    ? calculateSecurityRating(
        step3Data?.daytime_safety_rating,
        step3Data?.nighttime_safety_rating,
        step3Data?.bike_messed_with
      )
    : null;
  
  const usabilityRatings = [step4Data?.lock_ease_rating, step4Data?.space_rating, step4Data?.lighting_rating, step4Data?.maintenance_rating].filter((r): r is number => r !== null);
  const usabilityAvg = usabilityRatings.length > 0 ? usabilityRatings.reduce((sum, r) => sum + r, 0) / usabilityRatings.length : null;
  
  const supportRatings = [step5Data?.report_ease_rating, step5Data?.fix_speed_rating, step5Data?.communication_rating].filter((r): r is number => r !== null);
  const supportAvg = supportRatings.length > 0 ? supportRatings.reduce((sum, r) => sum + r, 0) / supportRatings.length : null;
  
  const hangarOKScore = usesHangar
    ? calculateHangarOKScore(communityVibe, securityRating, usabilityAvg, supportAvg)
    : null;
  
  const waitlistFairness = step5Data?.waitlist_fairness_rating ?? null;
  const iconRating = usesHangar ? hangarOKScore : waitlistFairness;
  const markerIcon = useMemo(() => {
    if (!isBrowser) return null;
    return createRatingFaceIcon({ rating: iconRating, size: 44 });
  }, [isBrowser, iconRating]);

  const openToSwapLabel = formatOpenToSwap(step1Data?.open_to_swap);
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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">{headerCaption}</p>
              <div className="mt-1 flex flex-col gap-1">
              <span className="text-lg font-semibold text-gray-900 leading-tight">{formatAddress(step1Data)}</span>
             
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
          {hangarOKScore !== null && (
            <div className="flex items-center gap-3 rounded-xl px-1.5 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(74,94,50,0.12)', color: ACCENT }}>
                {markerIcon && isBrowser && (
                  <div dangerouslySetInnerHTML={{ __html: markerIcon.options.html as string }} style={{ transform: 'scale(0.7)' }} />
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">HangarOK Score</p>
                <p className="text-sm font-semibold text-gray-800">
                  {hangarOKScore.toFixed(1)}/5
                </p>
              </div>
            </div>
          )}
          <InfoField icon={<MapPinIcon className="h-5 w-5" />} label="Hangar number" value={hangarNumber} />
          {usesHangar && (
            <InfoField icon={<ArrowsRightLeftIcon className="h-5 w-5" />} label="Open to swap" value={openToSwapLabel} />
          )}
          <InfoField icon={<ShareIcon className="h-5 w-5" />} label="Connection to hangar" value={connectionLabel} />
          <InfoField icon={<UserGroupIcon className="h-5 w-5" />} label="Usage" value={usageLabel} />
        </div>
      </div>
    </aside>
  );
};

export default ReviewInfoSidebar;
