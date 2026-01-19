import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import StarRating from '../ui/StarRating';
import CustomCheckbox from '../ui/CustomCheckbox';
import { umamiEventProps } from '../../utils/analytics';

interface Step5OwnerProps {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step5Owner: React.FC<Step5OwnerProps> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const maintenanceTagOptions = [
    { value: 'broken_lock', label: '🔧 Broken lock' },
    { value: 'lighting_out', label: '💡 Lighting out' },
    { value: 'someone_in_space', label: '🚲 Someone in my space' },
    { value: 'vandalism', label: '🔨 Vandalism' },
    { value: 'good_at_fixing', label: '✅ They\'re pretty good at fixing stuff' },
    { value: 'no_clear_contact', label: '❓ Not clear who to ask when something\'s wrong' },
    { value: 'no_one_responsible', label: '🤷 No one seems responsible for fixing things' },
  ];

  const waitlistTagOptions = [
    { value: 'waiting_too_long', label: '⌛ Waiting way too long' },
    { value: 'no_idea_position', label: '❓ No idea where I am on the list' },
    { value: 'more_hangars_needed', label: '🚲 More hangars needed' },
  ];

  // Determine if user has a hangar based on Step 1
  const hasHangar = formData.usesHangar === true;

  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-[rgb(74,94,50)]">
          When something goes wrong, do they fix it?
        </h2>
      </div>

      {hasHangar ? (
        /* User HAS a hangar */
        <>
          {/* Report ease rating */}
          <div>
            <StarRating
              label="How easy is it to report a problem?"
              value={formData.reportEaseRating}
              onChange={(value) => updateFormData({ reportEaseRating: value })}
              error={fieldErrors?.reportEaseRating}
            />
          </div>

          {/* Fix speed rating */}
          <div>
            <StarRating
              label="How quickly did they fix things?"
              value={formData.fixSpeedRating}
              onChange={(value) => updateFormData({ fixSpeedRating: value })}
              error={fieldErrors?.fixSpeedRating}
            />
          </div>

          {/* Communication rating */}
          <div>
            <StarRating
              label="Good communication?"
              value={formData.communicationRating}
              onChange={(value) => updateFormData({ communicationRating: value })}
              error={fieldErrors?.communicationRating}
            />
          </div>

          {/* Maintenance tags */}
          <div>
            <SelectableTagGroup
              label="Select all that apply"
              options={maintenanceTagOptions.map(t => t.label)}
              selectedOptions={(formData.maintenanceTags || []).map(value => {
                const option = maintenanceTagOptions.find(t => t.value === value);
                return option ? option.label : value;
              })}
              onChange={(selectedLabels) => {
                const selectedValues = selectedLabels.map(label => {
                  const option = maintenanceTagOptions.find(t => t.label === label);
                  return option ? option.value : label;
                });
                updateFormData({ maintenanceTags: selectedValues });
              }}
              multiSelect={true}
            />
          </div>
        </>
      ) : (
        /* User does NOT have a hangar (waitlist or blocked) */
        <>
          {/* Waiting fairness or Access fairness rating based on status */}
          <div>
            <StarRating
              label={formData.hangarAccessStatus === 'waiting_list' ? 'Waiting fairness' : 'Access fairness'}
              value={formData.waitlistFairnessRating}
              onChange={(value) => updateFormData({ waitlistFairnessRating: value })}
              error={fieldErrors?.waitlistFairnessRating}
            />
            <p className="mt-2 text-sm text-gray-600">
              How fair and transparent access to bike storage feels for riders on this street.
            </p>
          </div>

          {/* Waitlist tags */}
          <div>
            <SelectableTagGroup
              label="Select all that apply"
              options={waitlistTagOptions.map(t => t.label)}
              selectedOptions={(formData.waitlistTags || []).map(value => {
                const option = waitlistTagOptions.find(t => t.value === value);
                return option ? option.label : value;
              })}
              onChange={(selectedLabels) => {
                const selectedValues = selectedLabels.map(label => {
                  const option = waitlistTagOptions.find(t => t.label === label);
                  return option ? option.value : label;
                });
                updateFormData({ waitlistTags: selectedValues });
              }}
              multiSelect={true}
            />
          </div>
        </>
      )}

      {/* Improvement feedback - common for both */}
      <div>
        <label htmlFor="improvementFeedback" className="mb-2 block text-lg font-medium text-gray-800">
          Anything they could improve? <span className="text-sm text-gray-500">(Optional)</span>
        </label>
        <textarea
          id="improvementFeedback"
          value={formData.improvementFeedback || ''}
          onChange={(e) => updateFormData({ improvementFeedback: e.target.value })}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-[rgb(74,94,50)] focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] focus:ring-opacity-20"
          {...umamiEventProps('review:step5-feedback')}
        />
      </div>

      {/* Terms checkbox */}
      <div>
        <CustomCheckbox
          id="checkboxReadTerms"
          label={
            <>
              I have read and accept the{' '}
              <a
                href="/terminosCondiciones"
                target="_blank"
                rel="noopener noreferrer"
                className={`underline hover:text-[rgb(60,76,40)] ${fieldErrors?.checkboxReadTerms ? 'text-red-500' : 'text-[rgb(74,94,50)]'}`}
              >
                terms and conditions
              </a>
            </>
          }
          checked={Boolean(formData.checkboxReadTerms)}
          onChange={e => updateFormData({ checkboxReadTerms: e.target.checked })}
          error={fieldErrors?.checkboxReadTerms}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
          {...umamiEventProps('review:step5-previous')}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          {...umamiEventProps('review:step5-submit')}
        >
          {isSubmitting ? 'Submitting...' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default Step5Owner;
