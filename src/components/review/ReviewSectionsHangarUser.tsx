import React from 'react';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  QueueListIcon,
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  LockClosedIcon,
  ArrowsPointingOutIcon,
  LightBulbIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import { formatOptionLabel } from './reviewFormatting';
import { RatingRow, TagList, BooleanSignal, SectionCard } from './reviewShared';

type Props = {
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
};

const ReviewSectionsHangarUser: React.FC<Props> = ({ step2Data, step3Data, step4Data, step5Data }) => {
  const currentStorageLabel = formatOptionLabel(step3Data?.current_bike_storage) ?? null;

  return (
    <div className="space-y-4">
      <SectionCard title="Community Vibe" subtitle="How the hangar fits the neighbourhood" icon={<UserGroupIcon className="h-6 w-6 text-gray-500" />}>
          <div className="space-y-3">
            <RatingRow icon={<SparklesIcon className="h-5 w-5 text-black" />} label="Belonging" value={step2Data?.belongs_rating ?? null} />
            <RatingRow icon={<QueueListIcon className="h-5 w-5 text-black" />} label="Fair use" value={step2Data?.fair_use_rating ?? null} />
            <RatingRow icon={<ExclamationTriangleIcon className="h-5 w-5 text-black" />} label="Appearance" value={step2Data?.appearance_rating ?? null} />
          </div>
          <TagList title="Neighbours say…" tags={step2Data?.perception_tags} />
        </SectionCard>

      <SectionCard title="Safety Check" subtitle="Confidence leaving a bike inside" icon={<ShieldCheckIcon className="h-6 w-6 text-gray-500" />}>
          <div className="space-y-3">
            <RatingRow icon={<SunIcon className="h-5 w-5 text-black" />} label="Daytime safety" value={step3Data?.daytime_safety_rating ?? null} />
            <RatingRow icon={<MoonIcon className="h-5 w-5 text-black" />} label="Night safety" value={step3Data?.nighttime_safety_rating ?? null} />
            <RatingRow icon={<ExclamationTriangleIcon className="h-5 w-5 text-black" />} label="Worry about theft" value={step3Data?.theft_worry_rating ?? null} />
          </div>
          <BooleanSignal
            label="Has their bike been messed with?"
            value={step3Data?.bike_messed_with ?? null}
            positive={{ text: 'No issues reported', icon: '✅' }}
            negative={{ text: 'Yes, reported issues', icon: '⚠️' }}
          />
          {currentStorageLabel && (
            <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
              Currently stores their bike: <span className="font-semibold text-gray-700">{currentStorageLabel}</span>
            </div>
          )}
          <TagList title="Safety notes" tags={step3Data?.safety_tags} tone="warning" />
        </SectionCard>

      <SectionCard title="Everyday Usability" subtitle="How easy it is to use the hangar" icon={<BoltIcon className="h-6 w-6 text-gray-500" />}>
          <div className="space-y-3">
            <RatingRow icon={<LockClosedIcon className="h-5 w-5 text-black" />} label="Lock ease" value={step4Data?.lock_ease_rating ?? null} />
            <RatingRow icon={<ArrowsPointingOutIcon className="h-5 w-5 text-black" />} label="Space available" value={step4Data?.space_rating ?? null} />
            <RatingRow icon={<LightBulbIcon className="h-5 w-5 text-black" />} label="Lighting" value={step4Data?.lighting_rating ?? null} />
            <RatingRow icon={<WrenchScrewdriverIcon className="h-5 w-5 text-black" />} label="Maintenance" value={step4Data?.maintenance_rating ?? null} />
          </div>
          <TagList title="Usability notes" tags={step4Data?.usability_tags} />
        </SectionCard>

      <SectionCard title="Maintenance & Support" subtitle="How quickly things get fixed" icon={<WrenchScrewdriverIcon className="h-6 w-6 text-gray-500" />}>
          <div className="space-y-3">
            <RatingRow icon={<ChatBubbleLeftRightIcon className="h-5 w-5 text-black" />} label="Easy to report" value={step5Data?.report_ease_rating ?? null} />
            <RatingRow icon={<BoltIcon className="h-5 w-5 text-black" />} label="Fix speed" value={step5Data?.fix_speed_rating ?? null} />
            <RatingRow icon={<SparklesIcon className="h-5 w-5 text-black" />} label="Communication" value={step5Data?.communication_rating ?? null} />
          </div>
          <TagList title="Maintenance issues spotted" tags={step5Data?.maintenance_tags} tone="warning" />
        </SectionCard>
    </div>
  );
};

export default ReviewSectionsHangarUser;
