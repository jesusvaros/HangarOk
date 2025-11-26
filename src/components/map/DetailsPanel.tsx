import React from 'react';
import type { PublicReview } from '../../services/supabase/publicReviews';
import { Link } from 'react-router-dom';
import { ClockIcon, ChevronLeftIcon, ChevronRightIcon, QueueListIcon, UserGroupIcon, LockOpenIcon, ShieldCheckIcon, SparklesIcon, WrenchScrewdriverIcon, CubeIcon } from '@heroicons/react/24/outline';
import { umamiEventProps } from '../../utils/analytics';
import { SegmentedBar } from '../ui/SegmentedBar';

const BikeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </svg>
);

type Props = {
  review: PublicReview | null;
  onClose?: () => void;
  groupContext?: {
    index: number;
    total: number;
    onSelectIndex: (index: number) => void;
    hangarLabel?: string;
  };
};

export default function DetailsPanel({ review, onClose, groupContext }: Props) {
  const isCurrentUser = review?.uses_hangar === true;
  const isWaitingRider = review?.uses_hangar === false;
  const isGroupedView = Boolean(groupContext && groupContext.total > 1);
  const StatusIcon = isCurrentUser
      ? BikeIcon
      : isWaitingRider
        ? ClockIcon
        : UserGroupIcon;
  const statusIconWrapper = isCurrentUser
      ? 'bg-slate-200 text-slate-600'
      : isWaitingRider
        ? 'bg-slate-200 text-slate-600'
        : 'bg-slate-200 text-slate-600';
  const statusLabel = isGroupedView
    ? 'Hangar reviews'
    : isCurrentUser
      ? 'Hangar rider'
      : isWaitingRider
        ? 'Waiting rider'
        : 'Rider';
  const waitlistRating = typeof review?.waitlist_fairness_rating === 'number' ? review.waitlist_fairness_rating : null;
  const showNavigation = Boolean(groupContext && groupContext.total > 1);
  const navIndex = groupContext?.index ?? 0;
  const navTotal = groupContext?.total ?? 1;
  const displayHangarNumber = review?.hangar_number ?? groupContext?.hangarLabel ?? null;
  const theftAlert = review?.bike_messed_with === true;
  const goToPrevious = () => {
    if (!groupContext) return;
    groupContext.onSelectIndex(Math.max(0, groupContext.index - 1));
  };
  const goToNext = () => {
    if (!groupContext) return;
    groupContext.onSelectIndex(Math.min(groupContext.total - 1, groupContext.index + 1));
  };


  return (
    <div className={`flex flex-col h-full bg-white shadow-lg rounded-xl overflow-hidden`} >
      {theftAlert && (
        <div className="flex items-start gap-3 bg-red-100 px-3 py-3 text-black">
          <span className="mt-0.5 flex h-8 min-w-8 items-center justify-center rounded-full bg-[rgb(239,68,68)] text-white">
            <LockOpenIcon className="h-4 w-4" strokeWidth={3}/>
          </span>
          <div className="space-y-1 text-xs leading-tight">
            <p className="text-sm font-semibold uppercase ">
              Theft reported
            </p>
            <p className="text-[11px] text-black font-medium">
              Riders have reported theft or attempted theft at this hangar.
            </p>
          </div>
        </div>
      )}
      {/* Header with location and user status */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`flex h-9 w-9 min-w-9 min-h-9 items-center justify-center rounded-full ${statusIconWrapper}`}>
              {React.createElement(StatusIcon, { className: 'h-4 w-4' })}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{statusLabel}</h3>
              {displayHangarNumber ? (
                <p className="text-sm font-semibold text-slate-800 ">
                  Hangar {displayHangarNumber}
                </p>
              ):(
                <>
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                  {review?.full_address}
                </p>
                </>
              )}
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close details"
              className="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              onClick={onClose}
              {...umamiEventProps('map:details-close')}
            >
              ✕
            </button>
          )}
        </div>
       
        {showNavigation && (
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-medium">
              Review {navIndex + 1} of {navTotal}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous review in this hangar"
                onClick={goToPrevious}
                disabled={navIndex <= 0}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next review in this hangar"
                onClick={goToNext}
                disabled={navIndex >= navTotal - 1}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:hover:bg-slate-50 disabled:hover:text-slate-400 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

   

      {/* Content */}
      {review ? (
        <>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {isWaitingRider && waitlistRating !== null && (
              <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <QueueListIcon className="h-4 w-4" style={{ color: 'rgb(74,94,50)' }} />
                  <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Waitlist fairness</h4>
                </div>
                <SegmentedBar value={waitlistRating} color="rgb(74,94,50)" />
                <p className="mt-1.5 text-[10px] text-gray-500">
                  How fair and transparent the waiting list process feels to riders trying to get a space.
                </p>
              </div>
            )}

            {/* Breakdown Categories for Hangar Users */}
            {isCurrentUser && (() => {
              // Calculate category averages
              const communityRatings = [review.belongs_rating, review.fair_use_rating, review.appearance_rating].filter((r): r is number => r !== null);
              const communityAvg = communityRatings.length > 0 ? communityRatings.reduce((sum, r) => sum + r, 0) / communityRatings.length : null;

              const safetyRatings = [review.daytime_safety_rating, review.nighttime_safety_rating].filter((r): r is number => r !== null);
              const safetyAvg = safetyRatings.length > 0 ? safetyRatings.reduce((sum, r) => sum + r, 0) / safetyRatings.length : null;

              const usabilityRatings = [review.lock_ease_rating, review.space_rating, review.lighting_rating, review.maintenance_rating].filter((r): r is number => r !== null);
              const usabilityAvg = usabilityRatings.length > 0 ? usabilityRatings.reduce((sum, r) => sum + r, 0) / usabilityRatings.length : null;

              const supportRatings = [review.report_ease_rating, review.fix_speed_rating, review.communication_rating].filter((r): r is number => r !== null);
              const supportAvg = supportRatings.length > 0 ? supportRatings.reduce((sum, r) => sum + r, 0) / supportRatings.length : null;

              return (
                <div className="space-y-1.5">
                  {/* Community Vibe */}
                  {communityAvg !== null && (
                    <div className="bg-white rounded-lg p-2.5 border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="h-4 w-4 text-slate-600" />
                        <h4 className="text-xs font-bold uppercase text-slate-700">Community Vibe</h4>
                      </div>
                      <SegmentedBar value={communityAvg} color="rgb(74,94,50)" />
                    </div>
                  )}

                  {/* Safety Check */}
                  {safetyAvg !== null && (
                    <div className="bg-white rounded-lg p-2.5 border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheckIcon className="h-4 w-4 text-slate-600" />
                        <h4 className="text-xs font-bold uppercase text-slate-700">Safety Check</h4>
                      </div>
                      <SegmentedBar value={safetyAvg} color="rgb(74,94,50)" />
                    </div>
                  )}

                  {/* Everyday Usability */}
                  {usabilityAvg !== null && (
                    <div className="bg-white rounded-lg p-2.5 border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <CubeIcon className="h-4 w-4 text-slate-600" />
                        <h4 className="text-xs font-bold uppercase text-slate-700">Everyday Usability</h4>
                      </div>
                      <SegmentedBar value={usabilityAvg} color="rgb(74,94,50)" />
                    </div>
                  )}

                  {/* Maintenance & Support */}
                  {supportAvg !== null && (
                    <div className="bg-white rounded-lg p-2.5 border shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-slate-600" />
                        <h4 className="text-xs font-bold uppercase text-slate-700">Maintenance & Support</h4>
                      </div>
                      <SegmentedBar value={supportAvg} color="rgb(74,94,50)" />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        {review.id && (
            <div className="flex-shrink-0 border-t border-gray-100 bg-white px-3 py-2.5">
              <Link
                to={`/review/${review.id}`}
                className="inline-flex items-center gap-1 text-[rgb(74,94,50)] hover:underline"
                {...umamiEventProps('map:details-view-review', { hasSafetyRating: Boolean(review.overall_safety_rating) })}
              >
                View full details
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}</>
      ) : (
        <div className="flex-1 p-3">
          <p className="text-sm text-gray-500">
            Select a point on the map or an item from the list.
          </p>
        </div>
      )}
    </div>
  );
}
