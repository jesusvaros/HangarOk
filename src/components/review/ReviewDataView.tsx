import React from 'react';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import ReviewInfoSidebar from './ReviewInfoSidebar';
import ReviewRiderOpinions from './ReviewRiderOpinions';
import ReviewSectionsHangarUser from './ReviewSectionsHangarUser';
import ReviewSectionsWaitingRider from './ReviewSectionsWaitingRider';
import { formatOptionLabel, average } from './reviewFormatting';
import { RatingRow } from './reviewShared';
import { SparklesIcon, ShieldCheckIcon, BoltIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Props = {
  step1Data: AddressStepData | null;
  step2Data: Step2Data | null;
  step3Data: Step3Data | null;
  step4Data: Step4Data | null;
  step5Data: Step5Data | null;
};

const buildFeedbackEntries = (step2Data: Step2Data | null, step4Data: Step4Data | null, step5Data: Step5Data | null) =>
  [
    step2Data?.community_feedback?.trim()
      ? { label: 'Community notes', body: step2Data.community_feedback.trim() }
      : null,
    step4Data?.improvement_suggestion?.trim()
      ? { label: 'Ideas to improve', body: step4Data.improvement_suggestion.trim() }
      : null,
    step5Data?.improvement_feedback?.trim()
      ? { label: 'Feedback to council', body: step5Data.improvement_feedback.trim() }
      : null,
  ].filter((entry): entry is { label: string; body: string } => entry !== null);

const buildQuickMetrics = (
  step3Data: Step3Data | null,
  step4Data: Step4Data | null,
  step5Data: Step5Data | null,
  usesHangar: boolean,
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

  const metrics = [
    safetyAverage != null && { label: 'Overall safety', value: safetyAverage, icon: <ShieldCheckIcon className="h-5 w-5 text-black" /> },
    usabilityAverage != null && { label: 'Everyday usability', value: usabilityAverage, icon: <BoltIcon className="h-5 w-5 text-black" /> },
    supportAverage != null && {
      label: usesHangar ? 'Support & fixes' : 'Council responsiveness',
      value: supportAverage,
      icon: <WrenchScrewdriverIcon className="h-5 w-5 text-black" />,
    },
    step3Data?.theft_worry_rating != null && { label: 'Worry about theft', value: step3Data.theft_worry_rating, icon: <ExclamationTriangleIcon className="h-5 w-5 text-black" /> },
  ];

  return metrics.filter(Boolean) as Array<{ label: string; value: number; icon: React.ReactNode }>;
};

const ReviewDataView: React.FC<Props> = ({ step1Data, step2Data, step3Data, step4Data, step5Data }) => {
  const usesHangar = step1Data?.uses_hangar === true;
  const feedbackEntries = buildFeedbackEntries(step2Data, step4Data, step5Data);

  const currentStorageLabel = formatOptionLabel(step3Data?.current_bike_storage) ?? null;
  const impactLabel = step4Data?.stops_cycling ? formatOptionLabel(step4Data.stops_cycling) : null;
  const connectionLabel = step1Data?.connection_type ? formatOptionLabel(step1Data.connection_type) : null;
  return (
    <div className="lg:grid lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-8">
      <ReviewInfoSidebar
        step1Data={step1Data}
        step3Data={step3Data}
        usesHangar={usesHangar}
      />

      <div className="space-y-6">

        <ReviewRiderOpinions entries={feedbackEntries} />
        
        {usesHangar ? (
          <ReviewSectionsHangarUser
            step2Data={step2Data}
            step3Data={step3Data}
            step4Data={step4Data}
            step5Data={step5Data}
          />
        ) : (
          <ReviewSectionsWaitingRider
            step2Data={step2Data}
            step3Data={step3Data}
            step4Data={step4Data}
            step5Data={step5Data}
            connectionLabel={connectionLabel}
            currentStorageLabel={currentStorageLabel}
            impactLabel={impactLabel}
          />
        )}

      </div>
    </div>
  );
};

export default ReviewDataView;
