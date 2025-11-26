import React from 'react';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  QueueListIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  HandRaisedIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import { RatingRow, TagList, SectionCard } from './reviewShared';

type Props = {
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
  connectionLabel: string | null;
  currentStorageLabel: string | null;
  impactLabel: string | null;
};

const ReviewSectionsWaitingRider: React.FC<Props> = ({
  step2Data,
  step3Data,
  step4Data,
  step5Data,
  connectionLabel,
  currentStorageLabel,
  impactLabel,
}) => {
  const hasReportingData =
    typeof step5Data?.report_ease_rating === 'number' ||
    (step5Data?.maintenance_tags?.length ?? 0) > 0;

  // Calculate Community Vibe average (perception ratings)
  const communityRatings = [step2Data?.belongs_rating, step2Data?.fair_use_rating, step2Data?.appearance_rating].filter((r): r is number => r !== null);
  const communityAvg = communityRatings.length > 0 ? communityRatings.reduce((sum, r) => sum + r, 0) / communityRatings.length : null;

  return (
    <div className="space-y-4">
      <SectionCard title="Local Perspective" subtitle="How this rider connects with the hangar" icon={<UserGroupIcon className="h-6 w-6 text-gray-500" />}>
          {connectionLabel && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
              Connection: <span className="font-semibold">{connectionLabel}</span>
            </div>
          )}
          {currentStorageLabel && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
              <div>Stores bike: <span className="font-semibold">{currentStorageLabel}</span></div>
              <div className="mt-2">
                Worry about theft: <span className="font-semibold">
                  {step3Data?.theft_worry_rating !== null && step3Data?.theft_worry_rating !== undefined 
                    ? `${step3Data.theft_worry_rating}/5` 
                    : 'Not rated'}
                </span>
              </div>
            </div>
          )}
          {impactLabel && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
              Cycling impact: <span className="font-semibold">{impactLabel}</span>
            </div>
          )}
          <TagList title="Cycling impact" tags={step4Data?.impact_tags} tone="warning" />
        </SectionCard>

      <SectionCard 
        title="Perception & Safety" 
        subtitle="Feelings from outside the hangar" 
        icon={<ShieldCheckIcon className="h-6 w-6 text-gray-500" />}
        score={communityAvg}
      >
          <div className="space-y-3">
            <RatingRow icon={<SparklesIcon className="h-5 w-5 text-black" />} label="Belonging" value={step2Data?.belongs_rating ?? null} />
            <RatingRow icon={<HandRaisedIcon className="h-5 w-5 text-black" />} label="Fair use" value={step2Data?.fair_use_rating ?? null} />
            <RatingRow icon={<CameraIcon className="h-5 w-5 text-black" />} label="Appearance" value={step2Data?.appearance_rating ?? null} />
          </div>
          <TagList title="Safety worries" tags={step3Data?.safety_tags} tone="warning" />
          <TagList title="Community perception" tags={step2Data?.perception_tags} />
        </SectionCard>

      <SectionCard title="Access & Waitlist" subtitle="Experience trying to get a space" icon={<QueueListIcon className="h-6 w-6 text-gray-500" />}>
          <RatingRow icon={<QueueListIcon className="h-5 w-5 text-black" />} label="Waitlist fairness" value={step5Data?.waitlist_fairness_rating ?? null} />
          <RatingRow icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-black" />} label="Communication" value={step5Data?.communication_rating ?? null} />
          <RatingRow icon={<BoltIcon className="h-5 w-5 text-black" />} label="Fix speed" value={step5Data?.fix_speed_rating ?? null} />
          <TagList title="Waitlist notes" tags={step5Data?.waitlist_tags} />
        </SectionCard>

      {hasReportingData ? (
        <SectionCard
          title="Reporting Experience"
          subtitle="How easy it is to raise issues from the outside"
          icon={<WrenchScrewdriverIcon className="h-6 w-6 text-gray-500" />}
        >
          <RatingRow icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-black" />} label="Easy to report" value={step5Data?.report_ease_rating ?? null} />
          <TagList title="Maintenance concerns noticed" tags={step5Data?.maintenance_tags} tone="warning" />
        </SectionCard>
      ) : null}
    </div>
  );
};

export default ReviewSectionsWaitingRider;
