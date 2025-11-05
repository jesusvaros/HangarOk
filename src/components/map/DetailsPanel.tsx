import React from 'react';
import type { PublicReview } from '../../services/supabase/publicReviews';
import { Link } from 'react-router-dom';
import { MapPinIcon, CheckBadgeIcon, ClockIcon, SunIcon, MoonIcon, LockClosedIcon, ArrowsPointingOutIcon, LightBulbIcon, WrenchScrewdriverIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, QueueListIcon, ExclamationTriangleIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { umamiEventProps } from '../../utils/analytics';
import { formatOptionLabel } from '../review/reviewFormatting';

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

// Radial progress chart for overall ratings
const RadialChart = ({ value, maxValue = 5, size = 70, label }: { value: number; maxValue?: number; size?: number; label: string }) => {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 26;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r="26"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r="26"
            stroke="rgb(74,94,50)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: 'rgb(74,94,50)' }}>{value.toFixed(1)}</span>
        </div>
      </div>
      <span className="text-xs text-gray-600 text-center font-medium">{label}</span>
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
  };
  return iconMap[tag] || '•';
};

const getTagLabel = (tag: string) => {
  const labelMap: Record<string, string> = {
    'cyclists_unwelcome': 'Cyclists unwelcome',
    'out_of_place': 'Out of place',
    'takes_space': 'Takes car space',
    'people_moan': 'People complain',
    'more_like_this': 'More like this',
    'people_mock': 'People mock it',
    'car_parking_protected': 'Cars > bikes',
    'lock_tempting': 'Tempting to thieves',
    'dark_hidden': 'Dark/hidden',
    'people_hang': 'People hang around',
    'hangar_damaged': 'Gets damaged',
    'visible_neighbours': 'Visible to neighbors',
    'feels_safe': 'Feels safe',
    'door_heavy': 'Heavy door',
    'lock_jams': 'Lock jams',
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
  const safetyForHeader =
    typeof review?.overall_safety_rating === 'number'
      ? review.overall_safety_rating
      : typeof review?.theft_worry_rating === 'number'
        ? review.theft_worry_rating
        : typeof review?.waitlist_fairness_rating === 'number'
          ? review.waitlist_fairness_rating
          : undefined;
  const headerClass = safetyForHeader === undefined
    ? 'bg-gray-600'
    : safetyForHeader > 3
      ? 'bg-green-600'
      : safetyForHeader < 3
        ? 'bg-red-600'
        : 'bg-gray-600';
  const isCurrentUser = review?.uses_hangar === true;
  const isWaitingRider = review?.uses_hangar === false;
  const userIcon = isCurrentUser ? CheckBadgeIcon : ClockIcon;
  const userLabel = isCurrentUser ? 'Current User' : 'Waiting List / Nearby';
  const theftRating = typeof review?.theft_worry_rating === 'number' ? review.theft_worry_rating : null;
  const waitlistRating = typeof review?.waitlist_fairness_rating === 'number' ? review.waitlist_fairness_rating : null;
  const communicationRating = typeof review?.communication_rating === 'number' ? review.communication_rating : null;
  const fixSpeedRating = typeof review?.fix_speed_rating === 'number' ? review.fix_speed_rating : null;
  const belongsRating = typeof review?.belongs_rating === 'number' ? review.belongs_rating : null;
  const fairUseRating = typeof review?.fair_use_rating === 'number' ? review.fair_use_rating : null;
  const appearanceRating = typeof review?.appearance_rating === 'number' ? review.appearance_rating : null;
  const connectionLabel = formatOptionLabel(review?.connection_type ?? null);
  const currentStorageLabel = formatOptionLabel(review?.current_bike_storage ?? null);
  const stopsCyclingLabel = formatOptionLabel(review?.stops_cycling ?? null);
  const communityNote = review?.community_feedback?.trim() ?? '';
  const improvementNote = review?.improvement_feedback?.trim() ?? '';
  const waitingCommunityRatings = [
    belongsRating != null && { key: 'belonging', label: 'Belonging', value: belongsRating },
    fairUseRating != null && { key: 'fair_use', label: 'Fair use', value: fairUseRating },
    appearanceRating != null && { key: 'appearance', label: 'Appearance', value: appearanceRating },
  ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));
  const waitingSafetyRatings = [
    theftRating != null && { key: 'theft', label: 'Worry about theft', value: theftRating },
  ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));
  const waitingAccessRatings = [
    waitlistRating != null && { key: 'waitlist', label: 'Waitlist fairness', value: waitlistRating },
    communicationRating != null && { key: 'communication', label: 'Communication', value: communicationRating },
    fixSpeedRating != null && { key: 'fix_speed', label: 'Fix speed', value: fixSpeedRating },
  ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));
  const showNavigation = Boolean(groupContext && groupContext.total > 1);
  const navIndex = groupContext?.index ?? 0;
  const navTotal = groupContext?.total ?? 1;
  const displayHangarNumber = review?.hangar_number ?? groupContext?.hangarLabel ?? null;
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
      <div className={`${headerClass} text-white px-3 py-2 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {React.createElement(userIcon, { className: 'h-4 w-4 text-white' })}
            <h3 className="text-xs font-semibold">{userLabel}</h3>
          </div>
          {onClose && (
            <button
              type="button"
              aria-label="Close details"
              className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-md text-white/90 hover:text-white hover:bg-white/10"
              onClick={onClose}
              {...umamiEventProps('map:details-close')}
            >
              ✕
            </button>
          )}
        </div>
        {/* Location in header */}
        {(review?.full_address || displayHangarNumber) && (
          <div className="flex items-start gap-1 text-white/90">
            <MapPinIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col leading-tight">
              {review?.full_address && <p className="text-xs truncate">{review.full_address}</p>}
              {displayHangarNumber && <p className="text-xs font-semibold">Hangar {displayHangarNumber}</p>}
            </div>
          </div>
        )}
        {showNavigation && (
          <div className="mt-3 flex items-center justify-between text-[11px] text-white/80">
            <span className="font-medium">
              Review {navIndex + 1} of {navTotal}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous review in this hangar"
                onClick={goToPrevious}
                disabled={navIndex <= 0}
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Next review in this hangar"
                onClick={goToNext}
                disabled={navIndex >= navTotal - 1}
                className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      {review ? (
        <>
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2.5">
            {/* Overall Ratings - Radial Charts */}
            {!isWaitingRider && (review.overall_safety_rating || review.overall_usability_rating) && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200">
                <div className="flex justify-around items-center gap-4">
                  {review.overall_safety_rating && (
                    <RadialChart
                      value={review.overall_safety_rating}
                      label="Safety"
                      size={70}
                    />
                  )}
                  {review.overall_usability_rating && (
                    <RadialChart
                      value={review.overall_usability_rating}
                      label="Usability"
                      size={70}
                    />
                  )}
                </div>
              </div>
            )}

            {isWaitingRider && (
              <div className="space-y-2">
                {waitingCommunityRatings.length > 0 && (
                  <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <SparklesIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                      <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Community vibe</h4>
                    </div>
                    <div className="space-y-1.5">
                      {waitingCommunityRatings.map(item => (
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

                {waitingSafetyRatings.length > 0 && (
                  <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <ExclamationTriangleIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                      <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Safety outlook</h4>
                    </div>
                    <div className="space-y-1.5">
                      {waitingSafetyRatings.map(item => (
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

                {(connectionLabel || currentStorageLabel || stopsCyclingLabel) && (
                  <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                      <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Connection to hangar</h4>
                    </div>
                    <div className="space-y-1 text-[11px] text-gray-600">
                      {connectionLabel && (
                        <p><span className="font-semibold text-gray-700">Connection:</span> {connectionLabel}</p>
                      )}
                      {currentStorageLabel && (
                        <p><span className="font-semibold text-gray-700">Stores bike:</span> {currentStorageLabel}</p>
                      )}
                      {stopsCyclingLabel && (
                        <p><span className="font-semibold text-gray-700">Impact:</span> {stopsCyclingLabel}</p>
                      )}
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
                    {review.lighting_rating && (
                      <div className="flex items-center gap-1.5">
                        <LightBulbIcon className="h-3 w-3 flex-shrink-0" style={{ color: 'rgb(74,94,50)' }} />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Light</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.lighting_rating} color="rgb(74,94,50)" />
                        </div>
                      </div>
                    )}
                    {review.maintenance_rating && (
                      <div className="flex items-center gap-1.5">
                        <WrenchScrewdriverIcon className="h-3 w-3 flex-shrink-0" style={{ color: 'rgb(74,94,50)' }} />
                        <span className="text-[10px] text-gray-600 font-medium w-10 flex-shrink-0">Maint</span>
                        <div className="flex-1 min-w-0">
                          <RatingBar value={review.maintenance_rating} color="rgb(74,94,50)" />
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

              {review.impact_tags && review.impact_tags.length > 0 && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm" style={{ borderColor: 'rgb(74,94,50)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="p-1 rounded" style={{ backgroundColor: 'rgba(74,94,50,0.1)' }}>
                      <SparklesIcon className="h-3.5 w-3.5" style={{ color: 'rgb(74,94,50)' }} />
                    </div>
                    <h4 className="text-xs font-bold uppercase" style={{ color: 'rgb(74,94,50)' }}>Cycling impact</h4>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {review.impact_tags.map((tag) => (
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

              {(communityNote || improvementNote) && (
                <div className="bg-white rounded-lg p-2.5 border shadow-sm space-y-2" style={{ borderColor: 'rgb(74,94,50)' }}>
                  {communityNote && (
                    <div>
                      <h4 className="text-xs font-bold uppercase mb-1" style={{ color: 'rgb(74,94,50)' }}>Community notes</h4>
                      <p className="text-[11px] text-gray-600 whitespace-pre-wrap">{communityNote}</p>
                    </div>
                  )}
                  {improvementNote && (
                    <div>
                      <h4 className="text-xs font-bold uppercase mb-1" style={{ color: 'rgb(74,94,50)' }}>Feedback to council</h4>
                      <p className="text-[11px] text-gray-600 whitespace-pre-wrap">{improvementNote}</p>
                    </div>
                  )}
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
        </>
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
