import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import StarRating from '../ui/StarRating';
import { umamiEventProps } from '../../utils/analytics';

interface Step4CommunityProps {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step4Community: React.FC<Step4CommunityProps> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const usabilityTagOptions = [
    { value: 'door_heavy', label: '🚪 Door is heavy' },
    { value: 'lock_jams', label: '🔒 Lock / cylinder issues' },
    { value: 'cramped', label: '😣 Feels cramped' },
    { value: 'easy_to_use', label: '✅ Really easy to use' },
    { value: 'usually_clean', label: '🧹 Usually clean' },
  ];

  const impactTagOptions = [
    { value: 'avoid_cycling', label: '🚫 I avoid cycling' },
    { value: 'drive_instead', label: '🚗 I drive instead' },
    { value: 'no_nice_bikes', label: '🚲 I don\'t buy nicer bikes' },
    { value: 'would_ride_more', label: '✅ I\'d ride more with a safe hangar' },
  ];

  // Determine if user has a hangar based on Step 1
  const hasHangar = formData.usesHangar === true;

  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-[rgb(74,94,50)]">
          Does this make cycling easier for you?
        </h2>
      </div>

      {hasHangar ? (
        /* User HAS a hangar */
        <>
          {/* Lock ease rating */}
          <div>
            <StarRating
              label="How easy is it to lock and unlock your bike?"
              value={formData.lockEaseRating}
              onChange={(value) => updateFormData({ lockEaseRating: value })}
              error={fieldErrors?.lockEaseRating}
            />
          </div>

          {/* Space rating */}
          <div>
            <StarRating
              label="Is there space to get your bike in and out?"
              value={formData.spaceRating}
              onChange={(value) => updateFormData({ spaceRating: value })}
              error={fieldErrors?.spaceRating}
            />
          </div>

          {/* Lighting rating */}
          <div>
            <StarRating
              label="How's the lighting here?"
              value={formData.lightingRating}
              onChange={(value) => updateFormData({ lightingRating: value })}
              error={fieldErrors?.lightingRating}
            />
          </div>

          {/* Maintenance rating */}
          <div>
            <StarRating
              label="How well is it looked after?"
              value={formData.maintenanceRating}
              onChange={(value) => updateFormData({ maintenanceRating: value })}
              error={fieldErrors?.maintenanceRating}
            />
          </div>

          {/* Usability tags */}
          <div>
            <SelectableTagGroup
              label="Select all that apply"
              options={usabilityTagOptions.map(t => t.label)}
              selectedOptions={(formData.usabilityTags || []).map(value => {
                const option = usabilityTagOptions.find(t => t.value === value);
                return option ? option.label : value;
              })}
              onChange={(selectedLabels) => {
                const selectedValues = selectedLabels.map(label => {
                  const option = usabilityTagOptions.find(t => t.label === label);
                  return option ? option.value : label;
                });
                updateFormData({ usabilityTags: selectedValues });
              }}
              multiSelect={true}
            />
          </div>

          {/* Improvement suggestion */}
          <div>
            <label htmlFor="improvementSuggestion" className="mb-2 block text-lg font-medium text-gray-800">
              What's the one thing that would make this hangar better? <span className="text-sm text-gray-500">(Optional)</span>
            </label>
            <textarea
              id="improvementSuggestion"
              value={formData.improvementSuggestion || ''}
              onChange={(e) => updateFormData({ improvementSuggestion: e.target.value })}
              placeholder="Share your suggestion..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[rgb(74,94,50)] focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] focus:ring-opacity-20"
              {...umamiEventProps('review:step4-improvement')}
            />
          </div>
        </>
      ) : (
        /* User does NOT have a hangar (waitlist/nearby) */
        <>
          {/* Stops cycling */}
          <div>
            <SelectableTagGroup
              label="Is not having a hangar stopping you from cycling?"
              options={['Yes, a lot', 'Yes, a bit', 'Not really', 'No']}
              selectedOptions={
                formData.stopsCycling === 'yes_lot'
                  ? ['Yes, a lot']
                  : formData.stopsCycling === 'yes_bit'
                  ? ['Yes, a bit']
                  : formData.stopsCycling === 'not_really'
                  ? ['Not really']
                  : formData.stopsCycling === 'no'
                  ? ['No']
                  : []
              }
              onChange={(selected) => {
                const value = 
                  selected[0] === 'Yes, a lot' ? 'yes_lot' :
                  selected[0] === 'Yes, a bit' ? 'yes_bit' :
                  selected[0] === 'Not really' ? 'not_really' : 'no';
                updateFormData({ stopsCycling: value });
              }}
              multiSelect={false}
              error={fieldErrors?.stopsCycling}
            />
          </div>

          {/* Impact tags */}
          <div>
            <SelectableTagGroup
              label="Select all that apply"
              options={impactTagOptions.map(t => t.label)}
              selectedOptions={(formData.impactTags || []).map(value => {
                const option = impactTagOptions.find(t => t.value === value);
                return option ? option.label : value;
              })}
              onChange={(selectedLabels) => {
                const selectedValues = selectedLabels.map(label => {
                  const option = impactTagOptions.find(t => t.label === label);
                  return option ? option.value : label;
                });
                updateFormData({ impactTags: selectedValues });
              }}
              multiSelect={true}
            />
          </div>
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
          {...umamiEventProps('review:step4-previous')}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          {...umamiEventProps('review:step4-next')}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Step4Community;
