import React from 'react';
import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';
import type { Step2Data, Step3Data, Step4Data, Step5Data } from './reviewStepTypes';
import ReviewInfoSidebar from './ReviewInfoSidebar';
import ReviewRiderOpinions from './ReviewRiderOpinions';
import ReviewSectionsHangarUser from './ReviewSectionsHangarUser';
import ReviewSectionsWaitingRider from './ReviewSectionsWaitingRider';
import { formatOptionLabel } from './reviewFormatting';

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

const STOPS_CYCLING_LABELS: Record<string, string> = {
  yes_lot: 'Yes, it stops me from cycling a lot',
  yes_bit: 'Yes, it makes cycling harder',
  not_really: 'Not really',
  no: 'No, it doesn\'t stop me',
};

const ReviewDataView: React.FC<Props> = ({ step1Data, step2Data, step3Data, step4Data, step5Data }) => {
  const usesHangar = step1Data?.uses_hangar === true;
  const feedbackEntries = buildFeedbackEntries(step2Data, step4Data, step5Data);

  const currentStorageLabel = formatOptionLabel(step3Data?.current_bike_storage) ?? null;
  const impactLabel =
    step4Data?.stops_cycling ? STOPS_CYCLING_LABELS[step4Data.stops_cycling] ?? null : null;
  const connectionLabel = step1Data?.connection_type ? formatOptionLabel(step1Data.connection_type) : null;
  return (
    <div className="lg:grid lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-8">
      <ReviewInfoSidebar
        step1Data={step1Data}
        step2Data={step2Data}
        step3Data={step3Data}
        step4Data={step4Data}
        step5Data={step5Data}
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
