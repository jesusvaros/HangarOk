import React, { useState } from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import {
  StarIcon as StarIconOutline,
  CheckBadgeIcon,
  ClockIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

export type ReviewListItem = {
  id: string | number;
  lat?: number;
  lng?: number;
  would_recommend?: number;
  usability_rating?: number;
  texto?: string;
  comment?: string;
  uses_hangar?: boolean | null;
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
  groupedReviews?: Array<{
    id: string | number;
    full_address?: string | null;
    uses_hangar?: boolean | null;
    overall_safety_rating?: number | null;
    overall_usability_rating?: number | null;
    hangar_number?: string | null;
    theft_worry_rating?: number | null;
    waitlist_fairness_rating?: number | null;
    belongs_rating?: number | null;
    fair_use_rating?: number | null;
    appearance_rating?: number | null;
    perception_tags?: string[] | null;
    impact_tags?: string[] | null;
    waitlist_tags?: string[] | null;
  }>;
};

const getRatingLabel = (score: number): string => {
  if (score >= 4.8) return 'Excellent';
  if (score >= 4.3) return 'Excellent';
  if (score >= 3.8) return 'Great';
  if (score >= 2.8) return 'Average';
  if (score >= 1.8) return 'Poor';
  return 'Bad';
};

const getStarCount = (score: number): number => {
  if (score >= 4.8) return 5;
  if (score >= 4.3) return 4.5;
  if (score >= 3.8) return 4;
  if (score >= 2.8) return 3;
  if (score >= 1.8) return 2;
  return 1;
};

const StarDisplay = ({ score }: { score: number }) => {
  const starCount = getStarCount(score);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const isFull = i <= Math.floor(starCount);
        const isHalf = !isFull && i === Math.ceil(starCount) && starCount % 1 !== 0;
        if (isFull) {
          return <StarIconSolid key={i} className="h-3.5 w-3.5 text-yellow-400" />;
        }
        if (isHalf) {
          return (
            <span key={i} className="relative">
              <StarIconOutline className="h-3.5 w-3.5 text-yellow-400" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                <StarIconSolid className="h-3.5 w-3.5 text-yellow-400" />
              </span>
            </span>
          );
        }
        return <StarIconOutline key={i} className="h-3.5 w-3.5 text-gray-300" />;
      })}
    </div>
  );
};

type RatingTone = 'excellent' | 'average' | 'poor' | 'none';

const getRatingTone = (score?: number | null): RatingTone => {
  if (typeof score !== 'number' || Number.isNaN(score) || score <= 0) return 'none';
  if (score >= 4) return 'excellent';
  if (score <= 2.5) return 'poor';
  return 'average';
};

const RATING_BADGE_STYLES: Record<RatingTone, { background: string; dot: string; text: string }> = {
  excellent: { background: 'bg-white', dot: 'bg-emerald-500', text: 'text-slate-800' },
  average: { background: 'bg-white', dot: 'bg-slate-400', text: 'text-slate-700' },
  poor: { background: 'bg-white', dot: 'bg-rose-500', text: 'text-slate-800' },
  none: { background: 'bg-white', dot: 'bg-slate-300', text: 'text-slate-500' },
};

const RatingBadge = ({ label, tone }: { label: string; tone: RatingTone }) => {
  const styles = RATING_BADGE_STYLES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${styles.background} ${styles.text}`}>
      <span className={`h-2 w-2 rounded-full ${styles.dot}`} aria-hidden />
      <span>{label}</span>
    </span>
  );
};

const WAITLIST_TAGS_DISPLAY: Record<
  string,
  {
    icon: string;
    label: string;
  }
> = {
  waiting_too_long: { icon: '⌛', label: 'Waiting too long' },
  no_idea_position: { icon: '❓', label: 'Don\'t know position' },
  more_hangars_needed: { icon: '🚲', label: 'More hangars needed' },
};

const WAITLIST_TAG_ORDER = ['waiting_too_long', 'no_idea_position', 'more_hangars_needed'] as const;

const WaitlistInsights: React.FC<{ tags: string[] }> = ({ tags }) => {
  const tagSet = new Set(tags);
  const displayable = WAITLIST_TAG_ORDER
    .filter(tag => tagSet.has(tag))
    .map(tag => ({ tag, data: WAITLIST_TAGS_DISPLAY[tag] }))
    .filter(
      (entry): entry is { tag: (typeof WAITLIST_TAG_ORDER)[number]; data: { icon: string; label: string } } =>
        Boolean(entry.data),
    );

  return (
      <div className="flex flex-wrap gap-2 row">
        {displayable.map(({ tag, data }) => (
          <div key={tag} className="flex shrink-1 gap-1 text-[10px] font-semibold text-slate-600 border border-slate-400 px-2 py-1 rounded-xl items-center">
            <span className="text-base leading-none">{data.icon}</span>
            <span>{data.label}</span>
          </div>
        ))}
    </div>
  );
};

type UsageKey = 'users' | 'waiting' | 'unknown';

const usageKeyFromValue = (value?: boolean | null): UsageKey => {
  if (value === true) return 'users';
  if (value === false) return 'waiting';
  return 'unknown';
};

const USAGE_STYLES: Record<
  UsageKey,
  {
    categoryTitle: string;
    label: string;
    icon: typeof CheckBadgeIcon;
    iconWrapperClass: string;
    categoryTextClass: string;
  }
> = {
  users: {
    categoryTitle: 'Hangar riders',
    label: 'Hangar rider',
    icon: CheckBadgeIcon,
    iconWrapperClass: 'bg-emerald-100 text-emerald-700',
    categoryTextClass: 'text-slate-600',
  },
  waiting: {
    categoryTitle: 'Waiting & nearby riders',
    label: 'Waiting / nearby',
    icon: ClockIcon,
    iconWrapperClass: 'bg-amber-100 text-amber-700',
    categoryTextClass: 'text-slate-600',
  },
  unknown: {
    categoryTitle: 'Other riders',
    label: 'Usage unknown',
    icon: UserGroupIcon,
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
        <ul className="space-y-2 flex-1 overflow-auto p-1">
          {reviews.map((r) => {
            const id = r.id ?? `${r.lat}-${r.lng}`;
            const address = r.texto ?? '-';
            const score = r.would_recommend ?? 0;
            const isGroup = (r.groupCount ?? 0) > 1 && (r.groupedReviews?.length ?? 0) > 0;
            const isCurrentUser = !isGroup && r.uses_hangar === true;
            const isWaitingRider = !isGroup && r.uses_hangar === false;
            const waitlistTags = Array.isArray(r.waitlist_tags) ? r.waitlist_tags : [];
            const waitlistHasFeedback = isWaitingRider
              ? waitlistTags.some(tag => Boolean(WAITLIST_TAGS_DISPLAY[tag]))
              : false;
            const hasRating = !isWaitingRider && score > 0;
            const label = isWaitingRider
              ? waitlistHasFeedback
                ? 'Waiting list feedback'
                : 'No waiting list feedback yet'
              : hasRating
                ? getRatingLabel(score)
                : 'No rating yet';
            const reviewCount = r.groupCount ?? r.groupedReviews?.length ?? 0;
            const isSelected = String(selectedId ?? '') === String(id);
            const statusIconWrapper = isGroup
              ? 'bg-amber-100 text-emerald-700'
              : isCurrentUser
                ? 'bg-emerald-100 text-emerald-700'
                : isWaitingRider
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-200 text-slate-600';
            const statusLabel = isGroup
              ? 'Hangar reviews'
              : isCurrentUser
                ? 'Hangar rider'
                : isWaitingRider
                  ? 'Waiting rider'
                  : 'Rider';
            const ratingTone = hasRating ? getRatingTone(score) : 'none';
            const UserIcon = isGroup ? UserGroupIcon : isCurrentUser ? CheckBadgeIcon : ClockIcon;
            const expanded = expandedGroups[String(id)] ?? true;
            const toggleLabel = expanded ? 'Hide riders' : 'See riders';
            const toggleButton = (
              <button
                type="button"
                onClick={() => toggleGroup(String(id))}
                className="inline-flex items-center gap-1 rounded-md border border-amber-200 px-3 py-1.5 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>{toggleLabel}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${expanded ? '' : '-rotate-90'}`}
                />
              </button>
            );
            const cardClasses = [
              'overflow-hidden',
              'rounded-lg',
              'border',
              'bg-white',
              'transition',
              isGroup ? 'cursor-pointer' : 'cursor-default',
            ];
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
                    <div className="px-3 py-3 border-b bg-white flex items-start gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusIconWrapper}`}>
                          <UserIcon className="h-4 w-4" />
                        </span>
                        <div className="flex-1 min-w-0 space-y-1 flex justify-between ">
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Hangar
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {r.hangar_number ?? 'Unknown'}
                            </span>
                          </div>

                             <p className="text-xs text-slate-500">
                            {reviewCount} review{reviewCount === 1 ? '' : 's'} available
                          </p>
                          </div>   
                      </div>
               

                    <div className="px-3 py-3 space-y-3">
                      <p className="text-xs text-slate-500 mb-1 line-clamp-2">{address}</p>

                      {hasRating ? (
                          <div className="pt-1">{toggleButton}</div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-400 italic">{label}</p>
                          <div className="pt-1">{toggleButton}</div>
                        </div>
                      )}

                      {!expanded ? (
                        <p className="text-xs font-semibold text-slate-600">
                          Expand to compare all rider scores in this hangar.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {(Object.keys(USAGE_STYLES) as UsageKey[]).map((usageKey) => {
                            const members = (r.groupedReviews ?? []).filter(
                              (member) => usageKeyFromValue(member.uses_hangar ?? null) === usageKey,
                            );
                            if (members.length === 0) return null;
                            const meta = USAGE_STYLES[usageKey];

                            return (
                              <div key={usageKey} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className={`flex h-7 w-7 items-center justify-center rounded-full ${meta.iconWrapperClass}`}>
                                    {React.createElement(meta.icon, {
                                      className: 'h-3.5 w-3.5',
                                    })}
                                  </span>
                                  <p className={`text-xs font-semibold uppercase tracking-wide ${meta.categoryTextClass}`}>
                                    {meta.categoryTitle} · {members.length}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  {members.map((member) => {
                                    const safetyScore =
                                      typeof member.overall_safety_rating === 'number'
                                        ? member.overall_safety_rating
                                        : typeof member.theft_worry_rating === 'number'
                                          ? member.theft_worry_rating
                                          : null;
                                    const usabilityScore =
                                      typeof member.overall_usability_rating === 'number'
                                        ? member.overall_usability_rating
                                        : null;
                                    const memberAddress = member.full_address ?? 'Rider review';
                                    const memberIsWaiting = member.uses_hangar === false;
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
                                    const memberWaitlistTags = Array.isArray(member.waitlist_tags) ? member.waitlist_tags : [];

                                    return (
                                      <button
                                        key={member.id}
                                        type="button"
                                        onClick={() =>
                                          onSelect({
                                            id: member.id,
                                            texto: member.full_address ?? '-',
                                            would_recommend: safetyScore ?? undefined,
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
                                            waitlist_tags: memberWaitlistTags.length > 0 ? memberWaitlistTags : null,
                                          })
                                        }
                                        className="w-full rounded-lg border border-slate-200 px-3 py-3 text-left transition focus:outline-none hover:bg-amber-50 focus-visible:ring-2 focus-visible:ring-amber-400"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className={`flex h-6 w-6 items-center justify-center rounded-full ${meta.iconWrapperClass}`}>
                                              {React.createElement(meta.icon, {
                                                className: 'h-3.5 w-3.5',
                                              })}
                                            </span>
                                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                              {meta.label}
                                            </span>
                                          </div>
                                          <span
                                            className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700"
                                          >
                                            View review
                                          </span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{memberAddress}</p>
                                        <div className="mt-3 space-y-1.5">
                                          {memberIsWaiting ? (
                                            <>
                                              {memberWaitlistScore ? (
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-slate-600">Waitlist fairness</span>
                                                  <StarDisplay score={memberWaitlistScore} />
                                                </div>
                                              ) : null}
                                              <WaitlistInsights tags={memberWaitlistTags} />
                                            </>
                                          ) : (
                                            <>
                                              {safetyScore ? (
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-slate-600">Safety</span>
                                                  <StarDisplay score={safetyScore} />
                                                </div>
                                              ) : (
                                                <p className="text-[11px] text-gray-400 italic">
                                                  No safety score yet
                                                </p>
                                              )}
                                              {usabilityScore ? (
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-slate-600">Usability</span>
                                                  <StarDisplay score={usabilityScore} />
                                                </div>
                                              ) : null}
                                            </>
                                          )}
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
                    <div className="px-3 py-3 border-b bg-white flex items-center gap-3 cursor-pointer" onClick={() => onSelect(r)}>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusIconWrapper}`}>
                        <UserIcon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {statusLabel}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {r.hangar_number ? `Hangar ${r.hangar_number}` : 'Hangar'}
                        </p>
                      </div>
                      {hasRating ? <RatingBadge label={label} tone={ratingTone} /> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelect(r)}
                      className="block w-full px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <p className="mb-3 text-xs text-slate-500 line-clamp-2">{address}</p>
                      {isWaitingRider ? (
                        <>
                          {typeof r.waitlist_fairness_rating === 'number' && r.waitlist_fairness_rating > 0 ? (
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-slate-600">Waitlist fairness</span>
                              <StarDisplay score={r.waitlist_fairness_rating} />
                            </div>
                          ) : null}
                          <WaitlistInsights tags={waitlistTags} />
                        </>
                      ) : hasRating ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-600">Safety</span>
                            <StarDisplay score={score} />
                          </div>
                          {r.usability_rating && r.usability_rating > 0 ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-slate-600">Usability</span>
                              <StarDisplay score={r.usability_rating} />
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">{label}</p>
                      )}
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
