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
    textClass: string;
    accentClass: string;
    badgeClass: string;
    borderClass: string;
    hoverClass: string;
    focusRingClass: string;
  }
> = {
  users: {
    categoryTitle: 'Hangar riders',
    label: 'Hangar rider',
    icon: CheckBadgeIcon,
    textClass: 'text-green-700',
    accentClass: 'text-green-600',
    badgeClass: 'bg-green-100 text-green-800 border border-green-200',
    borderClass: 'border-green-200',
    hoverClass: 'hover:bg-green-50',
    focusRingClass: 'focus-visible:ring-green-500',
  },
  waiting: {
    categoryTitle: 'Waiting & nearby riders',
    label: 'Waiting / nearby',
    icon: ClockIcon,
    textClass: 'text-orange-700',
    accentClass: 'text-orange-600',
    badgeClass: 'bg-orange-100 text-orange-800 border border-orange-200',
    borderClass: 'border-orange-200',
    hoverClass: 'hover:bg-orange-50',
    focusRingClass: 'focus-visible:ring-orange-500',
  },
  unknown: {
    categoryTitle: 'Other riders',
    label: 'Usage unknown',
    icon: UserGroupIcon,
    textClass: 'text-slate-600',
    accentClass: 'text-slate-500',
    badgeClass: 'bg-slate-100 text-slate-700 border border-slate-200',
    borderClass: 'border-slate-200',
    hoverClass: 'hover:bg-slate-50',
    focusRingClass: 'focus-visible:ring-slate-500',
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

  const definecolor = (recommendation: number) => {
    if (!recommendation) {
      return 'bg-gray-600';
    }
    if (recommendation > 3) {
      return 'bg-green-600';
    }
    if (recommendation < 3) {
      return 'bg-red-600';
    }
    return 'bg-gray-600';
  };

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
            const theftScore =
              typeof r.theft_worry_rating === 'number' ? r.theft_worry_rating : null;
            const waitlistScore =
              typeof r.waitlist_fairness_rating === 'number' ? r.waitlist_fairness_rating : null;
            const belongingScore =
              typeof r.belongs_rating === 'number' ? r.belongs_rating : null;
            const fairUseScore =
              typeof r.fair_use_rating === 'number' ? r.fair_use_rating : null;
            const appearanceScore =
              typeof r.appearance_rating === 'number' ? r.appearance_rating : null;
            const waitingRatingItems = [
              theftScore != null && { key: 'theft', label: 'Worry about theft', value: theftScore },
              waitlistScore != null && { key: 'waitlist', label: 'Waitlist fairness', value: waitlistScore },
              belongingScore != null && { key: 'belonging', label: 'Belonging', value: belongingScore },
              fairUseScore != null && { key: 'fair_use', label: 'Fair use', value: fairUseScore },
              appearanceScore != null && { key: 'appearance', label: 'Appearance', value: appearanceScore },
            ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));
            const hasRating = isWaitingRider ? waitingRatingItems.length > 0 : score > 0;
            const label = hasRating ? getRatingLabel(score) : 'No rating yet';
            const reviewCount = r.groupCount ?? r.groupedReviews?.length ?? 0;
            const headerClass = definecolor(score);
            const isSelected = String(selectedId ?? '') === String(id);
            const userIconColor = isGroup
              ? 'text-blue-700'
              : isCurrentUser
                ? 'text-green-700'
                : 'text-orange-600';
            const badgeTextColor = isGroup
              ? 'text-blue-700'
              : isCurrentUser
                ? 'text-green-800'
                : 'text-orange-700';
            const badgeBackground = isGroup
              ? 'bg-blue-50 border-blue-200'
              : isCurrentUser
                ? 'bg-green-50 border-green-200'
                : 'bg-orange-50 border-orange-200';
            const UserIcon = isGroup ? UserGroupIcon : isCurrentUser ? CheckBadgeIcon : ClockIcon;
            const expanded = expandedGroups[String(id)] ?? true;
            const toggleLabel = expanded ? 'Hide riders' : 'See riders';
            const toggleButton = (
              <button
                type="button"
                onClick={() => toggleGroup(String(id))}
                className="inline-flex items-center gap-1 rounded-md border border-blue-200 px-3 py-1.5 text-[11px] font-semibold text-blue-800 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span>{toggleLabel}</span>
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform ${expanded ? '' : '-rotate-90'}`}
                />
              </button>
            );

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
                className={`overflow-hidden rounded-lg border bg-white transition ${
                  hoveredId === id ? 'ring-2 ring-amber-300 shadow-md' : 'shadow-sm'
                } ${isSelected ? 'ring-2 ring-green-600 bg-emerald-50' : ''} ${
                  isGroup ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                {isGroup ? (
                  <>
                    <div className={`px-3 py-2 border-b ${badgeBackground}`}>
                      <div className="flex items-start gap-2">
                        <UserIcon className={`h-4 w-4 ${userIconColor}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-semibold uppercase tracking-wide ${badgeTextColor}`}>
                              Hangar
                            </span>
                            <span className="text-sm font-bold text-blue-900">
                              {r.hangar_number ?? 'Unknown'}
                            </span>
                            {hasRating ? (
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${headerClass} text-white ml-auto`}
                              >
                                {label}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] font-medium text-blue-700 block">
                            {reviewCount} review{reviewCount === 1 ? '' : 's'} available
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-3 py-3 space-y-3">
                      <p className="text-xs text-gray-500 mb-1 line-clamp-2">{address}</p>

                      {hasRating ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-gray-700">Average safety</span>
                              <StarDisplay score={score} />
                            </div>
                            {r.usability_rating && r.usability_rating > 0 ? (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Average usability</span>
                                <StarDisplay score={r.usability_rating} />
                              </div>
                            ) : null}
                          </div>
                          <div className="pt-1">{toggleButton}</div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 italic">{label}</p>
                          <div className="pt-1">{toggleButton}</div>
                        </div>
                      )}

                      {!expanded ? (
                        <p className="text-xs font-semibold text-blue-700">
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
                                  {React.createElement(meta.icon, {
                                    className: `h-4 w-4 ${meta.accentClass}`,
                                  })}
                                  <p className={`text-xs font-semibold uppercase tracking-wide ${meta.textClass}`}>
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
                                    const memberWaitingItems = [
                                      memberTheftScore != null && { key: 'theft', label: 'Worry about theft', value: memberTheftScore },
                                      memberWaitlistScore != null && { key: 'waitlist', label: 'Waitlist fairness', value: memberWaitlistScore },
                                      memberBelongingScore != null && { key: 'belonging', label: 'Belonging', value: memberBelongingScore },
                                      memberFairUseScore != null && { key: 'fair_use', label: 'Fair use', value: memberFairUseScore },
                                      memberAppearanceScore != null && { key: 'appearance', label: 'Appearance', value: memberAppearanceScore },
                                    ].filter((item): item is { key: string; label: string; value: number } => Boolean(item));

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
                                          })
                                        }
                                        className={`w-full rounded-lg border px-3 py-3 text-left transition focus:outline-none ${meta.borderClass} ${meta.hoverClass} ${meta.focusRingClass}`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            {React.createElement(meta.icon, {
                                              className: `h-4 w-4 ${meta.accentClass}`,
                                            })}
                                            <span
                                              className={`text-xs font-semibold uppercase tracking-wide ${meta.textClass}`}
                                            >
                                              {meta.label}
                                            </span>
                                          </div>
                                          <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClass}`}
                                          >
                                            View review
                                          </span>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-600 line-clamp-2">{memberAddress}</p>
                                        <div className="mt-3 space-y-1.5">
                                          {memberIsWaiting ? (
                                            memberWaitingItems.length > 0 ? (
                                              memberWaitingItems.map(item => (
                                                <div key={item.key} className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                                                  <StarDisplay score={item.value} />
                                                </div>
                                              ))
                                            ) : (
                                              <p className="text-[11px] text-gray-400 italic">
                                                No waiting rider scores yet
                                              </p>
                                            )
                                          ) : (
                                            <>
                                              {safetyScore ? (
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-gray-600">Safety</span>
                                                  <StarDisplay score={safetyScore} />
                                                </div>
                                              ) : (
                                                <p className="text-[11px] text-gray-400 italic">
                                                  No safety score yet
                                                </p>
                                              )}
                                              {usabilityScore ? (
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs font-medium text-gray-600">Usability</span>
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
                    <div className={`px-3 py-2 border-b flex items-center justify-between ${badgeBackground}`}>
                      <div className="flex items-center gap-2">
                        <UserIcon className={`h-4 w-4 ${userIconColor}`} />
                        <span className={`text-xs font-bold uppercase tracking-wide ${badgeTextColor}`}>
                          {r.hangar_number ? `Hangar ${r.hangar_number}` : 'Hangar'}
                        </span>
                      </div>
                      {hasRating && (
                        <div className={`px-2 py-0.5 rounded text-xs font-bold ${headerClass} text-white`}>
                          {label}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelect(r)}
                      className="block w-full px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    >
                      <p className="mb-3 text-xs text-gray-500 line-clamp-2">{address}</p>
                      {isWaitingRider ? (
                        waitingRatingItems.length > 0 ? (
                          <div className="space-y-1.5">
                            {waitingRatingItems.map((item) => (
                              <div key={item.key} className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">{item.label}</span>
                                <StarDisplay score={item.value} />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">{label}</p>
                        )
                      ) : hasRating ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">Safety</span>
                            <StarDisplay score={score} />
                          </div>
                          {r.usability_rating && r.usability_rating > 0 ? (
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-600">Usability</span>
                              <StarDisplay score={r.usability_rating} />
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">{label}</p>
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
