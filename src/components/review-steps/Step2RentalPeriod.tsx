import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import { umamiEventProps } from '../../utils/analytics';

interface Step2Props {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step2RentalPeriod: React.FC<Step2Props> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const tagOptions = [
    { value: 'blends_in', label: '✅ Blends in fine' },
    { value: 'out_of_place', label: '🤔 Looks a bit out of place' },
    { value: 'takes_space', label: '🚗 Takes space from parked cars' },
    { value: 'people_moan', label: '😤 People moan about it' },
    { value: 'cyclists_unwelcome', label: '🚴 Cyclists don\'t feel welcome here' },
    { value: 'more_like_this', label: '👍 Should be more like this' },
    { value: 'people_mock', label: '😂 People laugh or mock it' },
  ];


  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-[rgb(74,94,50)]">
          Does it feel like it belongs here?
        </h2>
      </div>

      {/* Question 1: How well does this hangar belong here? */}
      <div>
        <SelectableTagGroup
          label="How well does this hangar belong here?"
          options={['1', '2', '3', '4', '5']}
          selectedOptions={formData.belongsRating ? [String(formData.belongsRating)] : []}
          onChange={(selected) => updateFormData({ belongsRating: Number(selected[0]) as 1|2|3|4|5 })}
          multiSelect={false}
          error={fieldErrors?.belongsRating}
        />
      </div>

      {/* Question 2: Is it a fair use of space on this street? */}
      <div>
        <SelectableTagGroup
          label="Is it a fair use of space on this street?"
          options={['1', '2', '3', '4', '5']}
          selectedOptions={formData.fairUseRating ? [String(formData.fairUseRating)] : []}
          onChange={(selected) => updateFormData({ fairUseRating: Number(selected[0]) as 1|2|3|4|5 })}
          multiSelect={false}
          error={fieldErrors?.fairUseRating}
        />
      </div>

      {/* Question 3: How does it look on your street? */}
      <div>
        <SelectableTagGroup
          label="How does it look on your street?"
          options={['1', '2', '3', '4', '5']}
          selectedOptions={formData.appearanceRating ? [String(formData.appearanceRating)] : []}
          onChange={(selected) => updateFormData({ appearanceRating: Number(selected[0]) as 1|2|3|4|5 })}
          multiSelect={false}
          error={fieldErrors?.appearanceRating}
        />
      </div>

      {/* Quick-select tags */}
      <div>
        <SelectableTagGroup
          label="Select all that apply"
          options={tagOptions.map(t => t.label)}
          selectedOptions={(formData.perceptionTags || []).map(value => {
            const option = tagOptions.find(t => t.value === value);
            return option ? option.label : value;
          })}
          onChange={(selectedLabels) => {
            const selectedValues = selectedLabels.map(label => {
              const option = tagOptions.find(t => t.label === label);
              return option ? option.value : label;
            });
            updateFormData({ perceptionTags: selectedValues });
          }}
          multiSelect={true}
        />
      </div>

      {/* Optional: What do people around here say about it? */}
      <div>
        <label htmlFor="communityFeedback" className="mb-2 block text-lg font-medium text-gray-800">
          What do people around here say about it? <span className="text-sm text-gray-500">(Optional)</span>
        </label>
        <textarea
          id="communityFeedback"
          value={formData.communityFeedback || ''}
          onChange={(e) => updateFormData({ communityFeedback: e.target.value })}
          placeholder="Share what you've heard from neighbors, cyclists, or people on your street..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 p-3 focus:border-[rgb(74,94,50)] focus:outline-none focus:ring-2 focus:ring-[rgb(74,94,50)] focus:ring-opacity-20"
          {...umamiEventProps('review:step2-feedback')}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
          {...umamiEventProps('review:step2-previous')}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          {...umamiEventProps('review:step2-next')}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Step2RentalPeriod;
