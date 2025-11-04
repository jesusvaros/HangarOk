import React, { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import { MapPinIcon, HomeModernIcon, ShareIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ShieldCheckIcon, BoltIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import { ACCENT, average, formatAddress, formatOptionLabel, HOME_TYPE_LABELS, CONNECTION_TYPE_LABELS } from './reviewFormatting';
import { RatingRow } from './reviewShared';

type ReviewInfoSidebarProps = {
  step1Data: AddressStepData | null;
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
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: ACCENT }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const buildQuickMetrics = (
  step3Data: Step3Data | null,
  step4Data: Step4Data | null,
  step5Data: Step5Data | null,
  usesHangar: boolean
) => {
  const safetyAverage = average([
    step3Data?.daytime_safety_rating ?? null,
    step3Data?.nighttime_safety_rating ?? null,
  ]);
  const usabilityAverage = average([
    step4Data?.lock_ease_rating ?? null,
    step4Data?.space_rating ?? null,
    step4Data?.lighting_rating ?? null,
    step4Data?.maintenance_rating ?? null,
  ]);
  const supportAverage = average([
    step5Data?.report_ease_rating ?? null,
    step5Data?.fix_speed_rating ?? null,
    step5Data?.communication_rating ?? null,
  ]);

  const theftIcon = <ExclamationTriangleIcon className="h-5 w-5" />;

  const metrics = [
    safetyAverage != null && { label: 'Overall safety', value: safetyAverage, icon: <ShieldCheckIcon className="h-5 w-5" /> },
    usabilityAverage != null && { label: 'Everyday usability', value: usabilityAverage, icon: <BoltIcon className="h-5 w-5" /> },
    supportAverage != null && {
      label: usesHangar ? 'Support & fixes' : 'Council responsiveness',
      value: supportAverage,
      icon: <WrenchScrewdriverIcon className="h-5 w-5" />,
    },
    step3Data?.theft_worry_rating != null && { label: 'Worry about theft', value: step3Data.theft_worry_rating, icon: theftIcon },
  ];

  return metrics.filter(Boolean) as Array<{ label: string; value: number; icon: React.ReactNode }>;
};

const ReviewInfoSidebar: React.FC<ReviewInfoSidebarProps> = ({
  step1Data,
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
  const markerIcon = useMemo(() => {
    if (!isBrowser) return null;
    return L.divIcon({
      className: '',
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:rgba(74,94,50,0.15);border-radius:9999px;position:relative;">
          <div style="width:14px;height:14px;background:${ACCENT};border-radius:9999px;box-shadow:0 0 0 4px rgba(74,94,50,0.2);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, [isBrowser]);

  const homeTypeLabel = formatOptionLabel(step1Data?.home_type) ?? HOME_TYPE_LABELS[step1Data?.home_type ?? ''] ?? null;
  const connectionLabel = formatOptionLabel(step1Data?.connection_type) ?? CONNECTION_TYPE_LABELS[step1Data?.connection_type ?? ''] ?? null;
  const usageLabel = usesHangar ? 'Uses the hangar regularly' : 'Does not currently rent a space';
  const quickMetrics = buildQuickMetrics(step3Data, step4Data, step5Data, usesHangar);
  const headerCaption = usesHangar ? 'Current hangar rider review' : 'Local rider / waiting list perspective';

  return (
    <aside className="mb-6 space-y-4 lg:mb-0 lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: ACCENT }}>
            <MapPinIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">{headerCaption}</p>
            <div className="mt-1 flex flex-col gap-1">
              <span className="text-lg font-semibold text-gray-900 leading-tight">{formatAddress(step1Data)}</span>
              {step1Data?.hangar_location?.number && (
                <span className="text-4xl font-black text-gray-900 leading-none">{step1Data.hangar_location.number}</span>
              )}
              {step1Data?.hangar_location?.postalCode && (
                <span className="text-sm text-gray-500">{step1Data.hangar_location.postalCode}</span>
              )}
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
      </div>

      <div className="grid gap-3">
        <InfoField icon={<HomeModernIcon className="h-5 w-5" />} label="Home type" value={homeTypeLabel} />
        <InfoField icon={<ShareIcon className="h-5 w-5" />} label="Connection to hangar" value={connectionLabel} />
        <InfoField icon={<UserGroupIcon className="h-5 w-5" />} label="Usage" value={usageLabel} />
      </div>

      {quickMetrics.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: ACCENT }}>
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">At a glance</h3>
              <p className="text-xs text-gray-500">Key scores from this review</p>
            </div>
          </div>
          <div className="space-y-3">
            {quickMetrics.map((metric) => (
              <RatingRow key={metric.label} icon={metric.icon} label={metric.label} value={metric.value} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ReviewInfoSidebar;
