import React from 'react';
import type { PublicReview } from '../../services/supabase/publicReviews';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, ClockIcon, SunIcon, MoonIcon, LockClosedIcon, ArrowsPointingOutIcon, WrenchScrewdriverIcon, ChevronLeftIcon, ChevronRightIcon, QueueListIcon, UserGroupIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { umamiEventProps } from '../../utils/analytics';

// Visual rating bar component
const RatingBar = ({ value, maxValue = 5, color = 'rgb(74,94,50)' }: { value: number; maxValue?: number; color?: string }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-bold min-w-[1.5rem] text-right" style={{ color }}>{value}/{maxValue}</span>
    </div>
  );
};

// Tag icon mapping
const getTagIcon = (tag: string) => {
  const iconMap: Record<string, string> = {
    // Perception tags
    'cyclists_unwelcome': '🚴',
    'out_of_place': '🤔',
    'takes_space': '🚗',
    'long_waitlist': '⏳',
    'people_moan': '😤',
    'more_like_this': '👍',
    'people_mock': '😂',
    'car_parking_protected': '🚙',
    // Safety tags
    'lock_tempting': '🔓',
    'dark_hidden': '🌑',
    'people_hang': '👥',
    'hangar_damaged': '🔨',
    'visible_neighbours': '👁️',
    'feels_safe': '✅',
    // Usability tags
    'door_heavy': '🚪',
    'lock_jams': '🔒',
    'cramped': '😣',
    'easy_to_use': '✅',
    'usually_clean': '🧹',
    // Maintenance tags
    'broken_lock': '🔧',
    'lighting_out': '💡',
    'someone_in_space': '🚲',
    'vandalism': '🔨',
    'good_at_fixing': '✅',
    'waiting_too_long': '⏳',
    'avoid_cycling': '🚳',
    'insurance_no_cover': '🛡️',
    'police_dont_care': '🚓',
    'no_clear_contact': '☎️',
    'no_idea_position': '🧭',
    'no_one_responsible': '🙅',
    'blends_in': '🫥',
    'more_hangars_needed': '➕',
  };
  return iconMap[tag] || '•';
};

const getTagLabel = (tag: string) => {
  const labelMap: Record<string, string> = {
    'cyclists_unwelcome': 'Cyclists unwelcome',
    'out_of_place': 'Out of place',
    'long_waitlist': 'Long waitlist / slow process',
    'takes_space': 'Takes up space',
    'people_moan': 'People complain',
    'more_like_this': 'More like this',
    'people_mock': 'People mock it',
    'car_parking_protected': 'Cars > bikes',
    'lock_tempting': 'Tempting to thieves',
    'dark_hidden': 'Feels dark / hidden',
    'people_hang': 'People hanging around',
    'hangar_damaged': 'Gets damaged',
    'visible_neighbours': 'Visible to neighbors',
    'feels_safe': 'Feels safe',
    'door_heavy': 'Heavy door',
    'lock_jams': 'Lock / cylinder issues',
    'cramped': 'Cramped',
    'easy_to_use': 'Easy to use',
    'usually_clean': 'Usually clean',
    'broken_lock': 'Broken lock',
    'lighting_out': 'Lighting out',
    'someone_in_space': 'Space occupied',
    'vandalism': 'Vandalism',
    'good_at_fixing': 'Good at fixing',
    'waiting_too_long': 'Waiting too long',
    'avoid_cycling': 'Avoids cycling',
    'insurance_no_cover': "Insurance didn't really help me",
    'police_dont_care': "Police don't follow up on thefts",
    'no_clear_contact': 'No clear contact',
    'no_idea_position': 'No idea where it is',
    'no_one_responsible': 'No one responsible',
    'blends_in': 'Blends in',
    'more_hangars_needed': 'More hangars needed',
  };
  return labelMap[tag] || tag.replace(/_/g, ' ');
};

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
      ? CheckBadgeIcon
      : isWaitingRider
        ? ClockIcon
        : UserGroupIcon;
  const statusIconWrapper = isCurrentUser
      ? 'bg-emerald-100 text-emerald-700'
      : isWaitingRider
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-200 text-slate-600';
  const statusLabel = isGroupedView
    ? 'Hangar reviews'
    : isCurrentUser
      ? 'Hangar rider'
      : isWaitingRider
        ? 'Waiting rider'
        : 'Rider';
  const waitlistRating = typeof review?.waitlist_fairness_rating === 'number' ? review.waitlist_fairness_rating : null;
  const communicationRating = typeof review?.communication_rating === 'number' ? review.communication_rating : null;
  const fixSpeedRating = typeof review?.fix_speed_rating === 'number' ? review.fix_speed_rating : null;
  const waitingAccessRatings = [
    waitlistRating != null && { key: 'waitlist', label: 'Waitlist fairness', value: waitlistRating },
    communicationRating != null && { key: 'communication', label: 'Communication', value: communicationRating },
    fixSpeedRating != null && { key: 'fix_speed', label: 'Fix speed', value: fixSpeedRating },
  ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));
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
    <div className="flex flex-col h-full max-h-[80vh] md:max-h-[45vh] bg-white">
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

   

      {/* Scrollable content */}
      {review ? (
        <div className="flex-1 overflow-y-auto overflow-x-hidden ">
           {theftAlert && (
        <div className="flex items-start gap-2 border-b border-rose-100 bg-rose-50 px-3 py-2 ">
          <span className="flex min-h-8 min-w-8 items-center justify-center rounded-full bg-rose-200 ">
            <LockOpenIcon className="h-4 w-4 text-black" strokeWidth={2} />
          </span>
          <div className="text-xs leading-tight">
            <p className="font-semibold uppercase tracking-wide">Theft reported</p>
            <p className="text-[11px]">
              Riders have reported theft or attempted theft at this hangar.
            </p>
          </div>
        </div>
      )}
          <div className=" p-2 space-y-2.5">

            {isWaitingRider && (
              <div className="space-y-2">
            
                {waitingAccessRatings.length > 0 && (
                  <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <QueueListIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                      <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Access & waitlist</h4>
                    </div>
                    <div className="space-y-1.5">
                      {waitingAccessRatings.map(item => (
                        <div key={item.key} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-600 font-medium w-24 flex-shrink-0">{item.label}</span>
                          <div className="flex-1 min-w-0">
                            <RatingBar value={item.value} color="rgb(74,94,50)" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Detailed Ratings with Visual Bars */}
            <div className="space-y-2">
              {/* Safety Ratings */} 
              {!isWaitingRider && (review.daytime_safety_rating || review.nighttime_safety_rating) && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <svg className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Safety</h4>
                  </div>
                  <div className="space-y-1.5">
                    {review.daytime_safety_rating && (
                      <div className="flex items-center gap-1.5">
                        <SunIcon className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Day</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.daytime_safety_rating} color="rgb(74,94,50)" />
                        </div>
                      </div>
                    )}
                    {review.nighttime_safety_rating && (
                      <div className="flex items-center gap-1.5">
                        <MoonIcon className="h-3 w-3 text-indigo-500 flex-shrink-0" />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Night</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.nighttime_safety_rating} color="rgb(74,94,50)" />
                        </div>
                      </div>
                    )}
                    {/* Safety Tags */}
                    {review.safety_tags && review.safety_tags.length > 0 && (
                      <div className="pt-1 border-t border-gray-200">
                        <div className="flex flex-wrap gap-0.5">
                          {review.safety_tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium"
                              style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: 'rgb(74,94,50)' }}
                            >
                              <span className="text-[10px]">{getTagIcon(tag)}</span>
                              <span>{getTagLabel(tag)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Usability Ratings */}
              {!isWaitingRider && (review.lock_ease_rating || review.space_rating || review.lighting_rating || review.maintenance_rating) && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <svg className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Usability</h4>
                  </div>
                  <div className="space-y-1.5">
                    {review.lock_ease_rating && (
                      <div className="flex items-center gap-1.5">
                        <LockClosedIcon className="h-3 w-3 flex-shrink-0" style={{ color: 'rgb(74,94,50)' }} />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Lock</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.lock_ease_rating} color="rgb(74,94,50)" />
                        </div>
                      </div>
                    )}
                    {review.space_rating && (
                      <div className="flex items-center gap-1.5">
                        <ArrowsPointingOutIcon className="h-3 w-3 flex-shrink-0" style={{ color: 'rgb(74,94,50)' }} />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Space</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.space_rating} color="rgb(74,94,50)" />
                        </div>
                      </div>
                    )}
                    {/* Usability Tags */}
                    {review.usability_tags && review.usability_tags.length > 0 && (
                      <div className="pt-1 border-t border-gray-200">
                        <div className="flex flex-wrap gap-0.5">
                          {review.usability_tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium"
                              style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: 'rgb(74,94,50)' }}
                            >
                              <span className="text-[10px]">{getTagIcon(tag)}</span>
                              <span>{getTagLabel(tag)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Community Perception Tags */}
              {review.perception_tags && review.perception_tags.length > 0 && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <svg className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0 a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Community</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {review.perception_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: 'rgb(74,94,50)' }}
                      >
                        <span className="text-xs">{getTagIcon(tag)}</span>
                        <span>{getTagLabel(tag)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {review.waitlist_tags && review.waitlist_tags.length > 0 && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <QueueListIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Waitlist experience</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {review.waitlist_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: 'rgb(74,94,50)' }}
                      >
                        <span className="text-xs">{getTagIcon(tag)}</span>
                        <span>{getTagLabel(tag)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

  

              {/* Maintenance Issues Tags */}
              {review.maintenance_tags && review.maintenance_tags.length > 0 && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <WrenchScrewdriverIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Issues</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {review.maintenance_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{ backgroundColor: 'rgba(74,94,50,0.1)', color: 'rgb(74,94,50)' }}
                      >
                        <span className="text-xs">{getTagIcon(tag)}</span>
                        <span>{getTagLabel(tag)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          )}
        </div>
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
