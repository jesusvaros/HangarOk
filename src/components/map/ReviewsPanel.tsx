import React, { useState } from 'react';
import {
  ClockIcon,
  ChevronDownIcon,
  LockOpenIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { SegmentedBar } from '../ui/SegmentedBar';
import HangarLogo from '../../assets/logohangarOK.svg';
import { getRatingTone, RATING_BAR_STYLES, type RatingTone } from '../../utils/ratingHelpers';

const BikeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </svg>
);

const HangarIcon = ({ className }: { className?: string }) => (
  <img 
    src={HangarLogo} 
    alt="Hangar" 
    className={className}
    style={{ 
      filter: 'grayscale(100%) brightness(0.7)',
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />
);

export type ReviewListItem = {
  id: string | number;
  lat?: number;
  lng?: number;
  hangarok_score?: number | null;
  usability_rating?: number;
  texto?: string;
  comment?: string;
  uses_hangar?: boolean | null;
  hangar_access_status?: string | null;
  hangar_number?: string | null;
  groupCount?: number;
  groupedIds?: (string | number)[];
  theft_worry_rating?: number | null;
  waitlist_fairness_rating?: number | null;
  belongs_rating?: number | null;
  fair_use_rating?: number | null;
  appearance_rating?: number | null;
  impact_tags?: string[] | null;
  perception_tags?: string[] | null;
  waitlist_tags?: string[] | null;
  connection_type?: string | null;
  current_bike_storage?: string | null;
  stops_cycling?: string | null;
  bike_messed_with?: boolean | null;
  groupedReviews?: Array<{
    id: string | number;
    full_address?: string | null;
    uses_hangar?: boolean | null;
    hangar_access_status?: string | null;
    overall_safety_rating?: number | null;
    overall_usability_rating?: number | null;
    hangarok_score?: number | null;
    hangar_number?: string | null;
    theft_worry_rating?: number | null;
    waitlist_fairness_rating?: number | null;
    belongs_rating?: number | null;
    fair_use_rating?: number | null;
    appearance_rating?: number | null;
    perception_tags?: string[] | null;
    impact_tags?: string[] | null;
    waitlist_tags?: string[] | null;
    bike_messed_with?: boolean | null;
  }>;
};

const RatingBar = ({ tone }: { tone: RatingTone }) => {
  const styles = RATING_BAR_STYLES[tone];
  return (
    <div className={`${styles.background} h-2 rounded-t-lg`} />
  );
};


type UsageKey = 'users' | 'waiting' | 'blocked';

const usageKeyFromValue = (usesHangar?: boolean | null, hangarAccessStatus?: string | null): UsageKey => {
  if (usesHangar === true) return 'users';
  if (usesHangar === false && hangarAccessStatus === 'no_hangar_nearby') return 'blocked';
  if (usesHangar === false) return 'waiting';
  return 'waiting';
};

const USAGE_STYLES: Record<
  UsageKey,
  {
    categoryTitle: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconWrapperClass: string;
    categoryTextClass: string;
  }
> = {
  users: {
    categoryTitle: 'Hangar riders',
    label: 'Hangar rider',
    icon: BikeIcon,
    iconWrapperClass: 'bg-slate-200 text-slate-600',
    categoryTextClass: 'text-slate-600',
  },
  waiting: {
    categoryTitle: 'Waiting riders',
    label: 'Waiting rider',
    icon: ClockIcon,
    iconWrapperClass: 'bg-slate-200 text-slate-600',
    categoryTextClass: 'text-slate-600',
  },
  blocked: {
    categoryTitle: 'Blocked riders',
    label: 'Blocked rider',
    icon: NoSymbolIcon,
    iconWrapperClass: 'bg-slate-200 text-slate-600',
    categoryTextClass: 'text-slate-600',
  },
};

interface ReviewsPanelProps {
  reviews: ReviewListItem[];
  hoveredId: string | number | null;
  setHoveredId: (id: string | number | null) => void;
  onSelect: (r: ReviewListItem) => void;
  selectedId?: string | number | null;
}

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
  reviews,
  hoveredId,
  setHoveredId,
  onSelect,
  selectedId,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !(prev[groupId] ?? true),
    }));
  };

  return (
    <div className="h-full min-h-0 flex flex-col p-1">
      {reviews.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center px-4">
          <div>
            <div className="text-2xl">😞</div>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              No reviews in this area yet
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-5 flex-1 overflow-auto p-1 pt-5">
          {reviews.map((r) => {
            const id = r.id ?? `${r.lat}-${r.lng}`;
            const address = r.texto ?? '-';
            const isGroup = (r.groupCount ?? 0) > 1 && (r.groupedReviews?.length ?? 0) > 0;
            const isCurrentUser = !isGroup && r.uses_hangar === true;
            const isBlockedRider = !isGroup && r.uses_hangar === false && r.hangar_access_status === 'no_hangar_nearby';
            const isWaitingRider = !isGroup && r.uses_hangar === false && (r.hangar_access_status === 'waiting_list' || r.hangar_access_status === null);
            
            // Use HangarOK Score for hangar users, waitlist fairness for waiting riders
            const hangarScore = typeof r.hangarok_score === 'number' ? r.hangarok_score : null;
            const waitlistRating = typeof r.waitlist_fairness_rating === 'number' && r.waitlist_fairness_rating > 0 
              ? r.waitlist_fairness_rating 
              : null;
            
            const displayScore = (isWaitingRider || isBlockedRider) ? waitlistRating : hangarScore;
            const hasRating = displayScore !== null && displayScore > 0;
            const hasWaitlistRating = waitlistRating !== null;
            const reviewCount = r.groupCount ?? r.groupedReviews?.length ?? 0;
            const isSelected = String(selectedId ?? '') === String(id);
            const statusIconWrapper = 'bg-slate-200 text-slate-600';
            const statusLabel = isGroup
              ? 'Hangar reviews'
              : isCurrentUser
                ? 'Hangar rider'
                : isBlockedRider
                  ? 'Blocked rider'
                  : isWaitingRider
                    ? 'Waiting rider'
                    : 'Rider';
            const ratingTone = displayScore !== null ? getRatingTone(displayScore) : 'none';
            const UserIcon = isGroup ? HangarIcon : isCurrentUser ? BikeIcon : isBlockedRider ? NoSymbolIcon : ClockIcon;
            const expanded = expandedGroups[String(id)] ?? true;
            const toggleLabel = expanded ? 'Hide riders' : 'See riders';
            const toggleButton = (
              <button
                type="button"
                onClick={() => toggleGroup(String(id))}
                className="inline-flex items-center gap-1 rounded-md border border-amber-200 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 "
              >
                <span>{toggleLabel}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${expanded ? '' : '-rotate-90'}`}
                />
              </button>
            );
            const theftAlert = isGroup
              ? (r.groupedReviews ?? []).some(member => member.bike_messed_with)
              : r.bike_messed_with === true;
            const theftBadge = theftAlert ? (
              <span className="inline-flex items-center gap-1 rounded-full  bg-red-500 text-white px-2.5 py-1 text-[10px] font-semibold">
                <LockOpenIcon className="h-3.5 w-3.5 text-white mr-0.5 shrink-0" strokeWidth={2.5} />
                Theft reported
              </span>
            ) : null;
            const cardClasses = [
              'relative',
              'rounded-lg',
              'border',
              'bg-white',
              'transition',
              isGroup ? 'cursor-pointer' : 'cursor-default',
            ];
            
            // Determine color bar class for grouped reviews
            let colorBarClass = '';
            if (isGroup && hasRating) {
              if (ratingTone === 'excellent') {
                colorBarClass = 'bg-emerald-600';
              } else if (ratingTone === 'poor') {
                colorBarClass = 'bg-rose-600';
              } else {
                colorBarClass = 'bg-slate-500';
              }
            }
            if (isSelected) {
              cardClasses.push('ring-2', 'ring-amber-400', 'bg-amber-50', 'shadow-md');
            } else if (hoveredId === id) {
              cardClasses.push('ring-1', 'ring-amber-300', 'shadow-md');
            } else {
              cardClasses.push('shadow-sm');
            }

            const handleListClick = (event: React.MouseEvent<HTMLLIElement>) => {
              if (!isGroup) return;
              if ((event.target as HTMLElement).closest('button')) return;
              onSelect(r);
            };

            return (
              <li
                key={id}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={handleListClick}
                className={cardClasses.join(' ')}
              >
                {isGroup ? (
                  <>
                    {theftBadge && (
                      <div className="absolute -right-1 -top-3 z-10">
                        {theftBadge}
                      </div>
                    )}
                    {colorBarClass && <div className={`${colorBarClass} h-2 rounded-t-lg`} />}
                    {hasRating && <RatingBar tone={ratingTone} />}
                    <div className="px-3 py-3 border-b bg-white flex items-start gap-3 rounded-t-lg">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusIconWrapper}`}>
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Hangar
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {r.hangar_number ?? 'Unknown'}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-right">
                            <p className="text-xs text-slate-500">
                              {reviewCount} review{reviewCount === 1 ? '' : 's'} available
                            </p>
                          </div>
                        </div>
            
                    </div>
               

                    <div className="px-3 py-3 space-y-3">
                      <p className="text-xs text-slate-500 mb-1 line-clamp-2">{address}</p>

                      {(() => {
                        // Calculate average HangarOK score from hangar users only
                        const hangarUserScores = (r.groupedReviews ?? [])
                          .filter(member => member.uses_hangar === true && typeof member.hangarok_score === 'number')
                          .map(member => member.hangarok_score as number);
                        
                        const avgScore = hangarUserScores.length > 0
                          ? hangarUserScores.reduce((sum, score) => sum + score, 0) / hangarUserScores.length
                          : null;

                        if (avgScore === null) {
                          return <div className="pt-1">{toggleButton}</div>;
                        }

                        const scoreTone = getRatingTone(avgScore);
                        let badgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
                        if (scoreTone === 'excellent') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                        else if (scoreTone === 'poor') badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';

                        return (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-[10px] font-medium text-slate-500">HangarOK Score</span>
                            <div className="pt-1 flex items-center justify-between gap-3 w-full">
                              {toggleButton}
                              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-md border ${badgeColor}`}>
                                <span className="text-xs font-medium">★</span>
                                <span className="text-sm font-bold">
                                  {avgScore.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {!expanded ? (
                        null
                      ) : (
                        <div className="space-y-4">
                          {(Object.keys(USAGE_STYLES) as UsageKey[]).map((usageKey) => {
                            const members = (r.groupedReviews ?? []).filter(
                              (member) => usageKeyFromValue(member.uses_hangar ?? null, member.hangar_access_status ?? null) === usageKey,
                            );
                            if (members.length === 0) return null;
                            const meta = USAGE_STYLES[usageKey];

                            return (
                              <div key={usageKey} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <p className={`text-xs font-semibold uppercase tracking-wide ${meta.categoryTextClass}`}>
                                    {meta.categoryTitle} · {members.length}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  {members.map((member) => {
                                    const usabilityScore =
                                      typeof member.overall_usability_rating === 'number'
                                        ? member.overall_usability_rating
                                        : null;
                                    const memberIsBlocked = member.uses_hangar === false && member.hangar_access_status === 'no_hangar_nearby';
                                    const memberIsWaiting = member.uses_hangar === false && (member.hangar_access_status === 'waiting_list' || member.hangar_access_status === null);
                                    const memberTheftScore =
                                      typeof member.theft_worry_rating === 'number'
                                        ? member.theft_worry_rating
                                        : null;
                                    const memberWaitlistScore =
                                      typeof member.waitlist_fairness_rating === 'number'
                                        ? member.waitlist_fairness_rating
                                        : null;
                                    const memberBelongingScore =
                                      typeof member.belongs_rating === 'number'
                                        ? member.belongs_rating
                                        : null;
                                    const memberFairUseScore =
                                      typeof member.fair_use_rating === 'number'
                                        ? member.fair_use_rating
                                        : null;
                                    const memberAppearanceScore =
                                      typeof member.appearance_rating === 'number'
                                        ? member.appearance_rating
                                        : null;

                                    // Determine member's rating for color bar
                                    const memberDisplayScore = (memberIsWaiting || memberIsBlocked) ? memberWaitlistScore : member.hangarok_score;
                                    const hasMemberRating = typeof memberDisplayScore === 'number' && memberDisplayScore > 0;
                                    const memberRatingTone = hasMemberRating ? getRatingTone(memberDisplayScore) : 'none';
                                    let memberColorBarClass = '';
                                    if (hasMemberRating) {
                                      if (memberRatingTone === 'excellent') {
                                        memberColorBarClass = 'bg-emerald-600';
                                      } else if (memberRatingTone === 'poor') {
                                        memberColorBarClass = 'bg-rose-600';
                                      } else {
                                        memberColorBarClass = 'bg-slate-500';
                                      }
                                    }

                                    return (
                                      <button
                                        key={member.id}
                                        type="button"
                                        onClick={() =>
                                          onSelect({
                                            id: member.id,
                                            texto: member.full_address ?? '-',
                                            hangarok_score: member.hangarok_score ?? null,
                                            usability_rating: usabilityScore ?? undefined,
                                            uses_hangar: member.uses_hangar ?? null,
                                            hangar_number: member.hangar_number ?? r.hangar_number ?? null,
                                            theft_worry_rating: memberTheftScore ?? null,
                                            waitlist_fairness_rating: memberWaitlistScore ?? null,
                                            belongs_rating: memberBelongingScore ?? null,
                                            fair_use_rating: memberFairUseScore ?? null,
                                            appearance_rating: memberAppearanceScore ?? null,
                                            perception_tags: member.perception_tags ?? null,
                                            impact_tags: member.impact_tags ?? null,
                                            waitlist_tags: null,
                                          })
                                        }
                                        className="relative w-full rounded-lg border border-slate-200 text-left transition focus:outline-none hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-400"
                                      >
                                        {memberColorBarClass && <div className={`${memberColorBarClass} h-2 rounded-t-lg`} />}
                                        {member.bike_messed_with && (
                                          <div className="absolute -right-2 -top-3">
                                            <div className="flex items-center gap-2 rounded-full bg-red-500 px-1.5 py-1.5">
                                              <LockOpenIcon className="h-3 w-3 text-white" strokeWidth={3} />
                                            </div>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-4 px-3 py-2">
                                          <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${meta.iconWrapperClass}`}>
                                            {React.createElement(meta.icon, {
                                              className: 'h-4 w-4',
                                            })}
                                          </span>
                                          <div className="flex-1 space-y-1">
                                            {memberIsWaiting ? (
                                              <>
                                                <span className="text-xs font-medium text-slate-600">Waiting fairness</span>
                                                <SegmentedBar value={memberWaitlistScore ?? 0} color="rgb(74,94,50)" />
                                              </>
                                            ) : memberIsBlocked ? (
                                              <>
                                                <span className="text-xs font-medium text-slate-600">Access fairness</span>
                                                <SegmentedBar value={memberWaitlistScore ?? 0} color="rgb(74,94,50)" />
                                              </>
                                            ) : (
                                              <>
                                                <span className="text-xs font-medium text-slate-600">HangarOK Score</span>
                                                <SegmentedBar value={member.hangarok_score ?? 0} color="rgb(74,94,50)" />
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {theftBadge && (
                      <div className="absolute -right-1 -top-3 z-10">
                        {theftBadge}
                      </div>
                    )}
                    {(hasRating || hasWaitlistRating) && <RatingBar tone={ratingTone} />}
                    <div className="px-3 py-3 border-b bg-white flex items-center gap-3 cursor-pointer" onClick={() => onSelect(r)}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusIconWrapper}`}>
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {statusLabel}
                        </p>
                        {(isCurrentUser && r.hangar_number) && (
                          <p className="text-sm font-semibold text-slate-800">
                            Hangar {r.hangar_number}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelect(r)}
                      className="block w-full px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 "
                    >
                      <p className="mb-3 text-xs text-slate-500 line-clamp-2">{address}</p>
                      {isWaitingRider ? (
                        <>
                          {typeof r.waitlist_fairness_rating === 'number' && r.waitlist_fairness_rating > 0 ? (
                            <div className="space-y-1 mb-2">
                              <span className="text-xs font-medium text-slate-600">Waiting fairness</span>
                              <SegmentedBar value={r.waitlist_fairness_rating} color="rgb(74,94,50)" />
                            </div>
                          ) : null}
                        </>
                      ) : isBlockedRider ? (
                        <>
                          {typeof r.waitlist_fairness_rating === 'number' && r.waitlist_fairness_rating > 0 ? (
                            <div className="space-y-1 mb-2">
                              <span className="text-xs font-medium text-slate-600">Access fairness</span>
                              <SegmentedBar value={r.waitlist_fairness_rating} color="rgb(74,94,50)" />
                            </div>
                          ) : null}
                        </>
                      ) : hasRating ? (
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-slate-600">HangarOK Score</span>
                            <SegmentedBar value={r.hangarok_score ?? 0} color="rgb(74,94,50)" />
                          </div>
                        </div>
                      ) : null}
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ReviewsPanel;
