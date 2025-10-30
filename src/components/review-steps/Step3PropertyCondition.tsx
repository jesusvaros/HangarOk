import React from 'react';
import { useFormContext } from '../../store/useFormContext';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import { umamiEventProps } from '../../utils/analytics';

interface Step3Props {
  onNext: () => void;
  onPrevious: () => void;
  fieldErrors?: {
    [key: string]: boolean;
  };
  isSubmitting?: boolean;
}

const Step3PropertyCondition: React.FC<Step3Props> = ({
  onNext,
  onPrevious,
  fieldErrors,
  isSubmitting,
}) => {
  const { formData, updateFormData } = useFormContext();

  const safetyTagOptions = [
    { value: 'lock_tempting', label: '🔓 Lock looks tempting to thieves' },
    { value: 'dark_hidden', label: '🌑 Feels a bit dark / hidden' },
    { value: 'people_hang', label: '👥 People hang around' },
    { value: 'hangar_damaged', label: '🔨 The hangar gets damaged' },
    { value: 'visible_neighbours', label: '👁️ Visible to neighbours' },
    { value: 'feels_safe', label: '✅ Feels safe on this street' },
    { value: 'police_dont_care', label: '🚔 Police don\'t take bike theft seriously' },
    { value: 'insurance_no_cover', label: '🛡️ Insurance doesn\'t really cover me' },
    { value: 'cars_too_close', label: '🚗 Cars park too close - feels unsafe' },
  ];

  // Determine if user has a hangar based on Step 1
  const hasHangar = formData.usesHangar === true;


  return (
    <div className="w-full space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-semibold text-[rgb(74,94,50)]">
          Do you trust leaving your bike here?
        </h2>
      </div>

      {hasHangar ? (
        /* User HAS a hangar */
        <>
          {/* Daytime safety rating */}
          <div>
            <SelectableTagGroup
              label="Daytime — how safe?"
              options={['1', '2', '3', '4', '5']}
              selectedOptions={formData.daytimeSafetyRating ? [String(formData.daytimeSafetyRating)] : []}
              onChange={(selected) => updateFormData({ daytimeSafetyRating: Number(selected[0]) as 1|2|3|4|5 })}
              multiSelect={false}
              error={fieldErrors?.daytimeSafetyRating}
            />
          </div>

          {/* Nighttime safety rating */}
          <div>
            <SelectableTagGroup
              label="Night-time — how safe?"
              options={['1', '2', '3', '4', '5']}
              selectedOptions={formData.nighttimeSafetyRating ? [String(formData.nighttimeSafetyRating)] : []}
              onChange={(selected) => updateFormData({ nighttimeSafetyRating: Number(selected[0]) as 1|2|3|4|5 })}
              multiSelect={false}
              error={fieldErrors?.nighttimeSafetyRating}
            />
          </div>

          {/* Has bike been messed with */}
          <div>
            <SelectableTagGroup
              label="Has your bike ever been messed with here?"
              options={['Yes', 'No']}
              selectedOptions={
                formData.bikeMessedWith === true
                  ? ['Yes']
                  : formData.bikeMessedWith === false
                  ? ['No']
                  : []
              }
              onChange={(selected) => {
                const value = selected[0] === 'Yes' ? true : false;
                updateFormData({ bikeMessedWith: value });
              }}
              multiSelect={false}
              error={fieldErrors?.bikeMessedWith}
            />
          </div>
        </>
      ) : (
        /* User does NOT have a hangar */
        <>
          {/* Where do you keep your bike */}
          <div>
            <SelectableTagGroup
              label="Where do you keep your bike right now?"
              options={['Railings', 'Inside', 'Hallway', 'Nowhere secure', 'Something else']}
              selectedOptions={
                formData.currentBikeStorage === 'railings'
                  ? ['Railings']
                  : formData.currentBikeStorage === 'inside'
                  ? ['Inside']
                  : formData.currentBikeStorage === 'hallway'
                  ? ['Hallway']
                  : formData.currentBikeStorage === 'nowhere_secure'
                  ? ['Nowhere secure']
                  : formData.currentBikeStorage === 'other'
                  ? ['Something else']
                  : []
              }
              onChange={(selected) => {
                const value = 
                  selected[0] === 'Railings' ? 'railings' :
                  selected[0] === 'Inside' ? 'inside' :
                  selected[0] === 'Hallway' ? 'hallway' :
                  selected[0] === 'Nowhere secure' ? 'nowhere_secure' : 'other';
                updateFormData({ currentBikeStorage: value });
              }}
              multiSelect={false}
              error={fieldErrors?.currentBikeStorage}
            />
          </div>

          {/* How worried about theft */}
          <div>
            <SelectableTagGroup
              label="How worried about theft are you?"
              options={['1', '2', '3', '4', '5']}
              selectedOptions={formData.theftWorryRating ? [String(formData.theftWorryRating)] : []}
              onChange={(selected) => updateFormData({ theftWorryRating: Number(selected[0]) as 1|2|3|4|5 })}
              multiSelect={false}
              error={fieldErrors?.theftWorryRating}
            />
          </div>
        </>
      )}

      {/* Safety tags - common for both */}
      <div>
        <SelectableTagGroup
          label="Select all that apply"
          options={safetyTagOptions.map(t => t.label)}
          selectedOptions={(formData.safetyTags || []).map(value => {
            const option = safetyTagOptions.find(t => t.value === value);
            return option ? option.label : value;
          })}
          onChange={(selectedLabels) => {
            const selectedValues = selectedLabels.map(label => {
              const option = safetyTagOptions.find(t => t.label === label);
              return option ? option.value : label;
            });
            updateFormData({ safetyTags: selectedValues });
          }}
          multiSelect={true}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="text-black hover:text-gray-800"
          {...umamiEventProps('review:step3-previous')}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          {...umamiEventProps('review:step3-next')}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Step3PropertyCondition;
