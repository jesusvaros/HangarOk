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

const formatScoreValue = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(1);

type ScoreBadgeVariant = 'positive' | 'negative' | 'neutral';

const SCORE_BADGE_STYLES: Record<ScoreBadgeVariant, { container: string; dot: string }> = {
  positive: { container: 'bg-white text-slate-700 border border-slate-200', dot: 'bg-emerald-500' },
  negative: { container: 'bg-white text-slate-700 border border-slate-200', dot: 'bg-rose-500' },
  neutral: { container: 'bg-white text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

const ScoreBadge = ({ label, value, variant = 'neutral' }: { label: string; value: number; variant?: ScoreBadgeVariant }) => {
  const styles = SCORE_BADGE_STYLES[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles.container}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} aria-hidden />
      <span>{label}</span>
      <span>{formatScoreValue(value)}</span>
    </span>
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

const WAITING_SCORE_LABELS: Record<string, string> = {
  theft: 'Worry about theft',
  waitlist: 'Waitlist',
  belonging: 'Belonging',
  fair_use: 'Fair use',
  appearance: 'Appearance',
};

type WaitingMetric = { key: string; label: string; value: number };

const selectWaitingMetricGroups = (metrics: WaitingMetric[]) => {
  const positives = metrics
    .filter(metric => metric.value >= 4)
    .sort((a, b) => b.value - a.value);
  const negatives = metrics
    .filter(metric => metric.value <= 2.5)
    .sort((a, b) => a.value - b.value);

  return {
    positives: positives.slice(0, 1),
    negatives: negatives.slice(0, 1),
  };
};

const WaitingMetricSummary: React.FC<{ metrics: WaitingMetric[] }> = ({ metrics }) => {
  const { positives, negatives } = selectWaitingMetricGroups(metrics);

  if (positives.length === 0 && negatives.length === 0) {
    return <p className="text-[11px] text-slate-400 italic">No waiting rider scores yet</p>;
  }

  return (
    <div className="space-y-2">
      {negatives.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Needs attention</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {negatives.map(item => (
              <ScoreBadge key={`neg-${item.key}`} label={item.label} value={item.value} variant="negative" />
            ))}
          </div>
        </div>
      )}
      {positives.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Riders like</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {positives.map(item => (
              <ScoreBadge key={`pos-${item.key}`} label={item.label} value={item.value} variant="positive" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
            const waitingRatingItems: WaitingMetric[] = [
              theftScore != null && { key: 'theft', label: WAITING_SCORE_LABELS.theft, value: theftScore },
              waitlistScore != null && { key: 'waitlist', label: WAITING_SCORE_LABELS.waitlist, value: waitlistScore },
              belongingScore != null && { key: 'belonging', label: WAITING_SCORE_LABELS.belonging, value: belongingScore },
              fairUseScore != null && { key: 'fair_use', label: WAITING_SCORE_LABELS.fair_use, value: fairUseScore },
              appearanceScore != null && { key: 'appearance', label: WAITING_SCORE_LABELS.appearance, value: appearanceScore },
            ].filter((item): item is WaitingMetric => Boolean(item));
            const waitingHasInsights = waitingRatingItems.length > 0;
            const hasRating = !isWaitingRider && score > 0;
            const label = isWaitingRider
              ? waitingHasInsights
                ? 'Rider feedback'
                : 'No rating yet'
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
                                    const memberWaitingItems = [
                                      memberTheftScore != null && { key: 'theft', label: WAITING_SCORE_LABELS.theft, value: memberTheftScore },
                                      memberWaitlistScore != null && { key: 'waitlist', label: WAITING_SCORE_LABELS.waitlist, value: memberWaitlistScore },
                                      memberBelongingScore != null && { key: 'belonging', label: WAITING_SCORE_LABELS.belonging, value: memberBelongingScore },
                                      memberFairUseScore != null && { key: 'fair_use', label: WAITING_SCORE_LABELS.fair_use, value: memberFairUseScore },
                                      memberAppearanceScore != null && { key: 'appearance', label: WAITING_SCORE_LABELS.appearance, value: memberAppearanceScore },
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
                                            <WaitingMetricSummary metrics={memberWaitingItems} />
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
                    <div className="px-3 py-3 border-b bg-white flex items-center gap-3 cursor-pointer" onClick={() => onSelect(r)} >
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
                        <WaitingMetricSummary metrics={waitingRatingItems} />
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
