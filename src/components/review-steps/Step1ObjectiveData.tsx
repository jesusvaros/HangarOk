import { useEffect, useState } from 'react';
import { useFormContext } from '../../store/useFormContext';
import AddressAutocomplete, { type AddressResult } from '../ui/AddressAutocomplete';
import LocationMap from '../ui/LocationMap';
import SelectableTagGroup from '../ui/SelectableTagGroup';
import { useMapLocationHandler } from './location/mapLocationHandler';
import { geocodingService } from '../ui/address/geocodingService';
import type { FormDataType } from '../../store/formTypes';
import { umamiEventProps } from '../../utils/analytics';

interface Step1Props {
  onNext: () => void;
  fieldErrors?: {
    hangarLocation?: boolean;
    homeLocation?: boolean;
    usesHangar?: boolean;
    homeType?: boolean;
    connectionType?: boolean;
  };
  isSubmitting?: boolean;
}

const Step1ObjectiveData = ({ onNext, fieldErrors, isSubmitting = false }: Step1Props) => {
  const { formData, updateFormData } = useFormContext();
  
  // Local state for hangar location
  const [hangarLocation, setHangarLocation] = useState<FormDataType['hangarLocation']>(
    formData.hangarLocation || {}
  );

  useEffect(() => {
    setHangarLocation(formData.hangarLocation || {});
  }, [formData.hangarLocation]);

  // Helper to convert AddressResult to location format
  function resultToLocation(r: AddressResult): FormDataType['hangarLocation'] {
    const c = r.components || {};
    return {
      street: c.road || '',
      number: c.house_number || '',
      city: c.city || c.town || c.village || '',
      postalCode: c.postcode || '',
      state: c.state || '',
      fullAddress: r.formatted || '',
      coordinates: {
        lat: r.geometry.lat,
        lng: r.geometry.lng,
      },
      components: c,
    };
  }

  // Hangar location handlers
  const handleHangarSelect = (result: AddressResult) => {
    const converted = resultToLocation(result);
    setHangarLocation(converted);
    updateFormData({ hangarLocation: converted });
  };

  const handleHangarLocationSelect = useMapLocationHandler(result => {
    const converted = resultToLocation(result);
    setHangarLocation(converted);
    updateFormData({ hangarLocation: converted });
  });

  const handleHangarNumberChange = (number: string) => {
    const updated = { ...hangarLocation, number };
    setHangarLocation(updated);
    updateFormData({ hangarLocation: updated });
  };

  const handleHangarNumberBlur = async (number: string) => {
    if (hangarLocation?.street && hangarLocation.street.trim() !== '' && number.trim() !== '') {
      const updatedResult = await geocodingService.getCoordinatesForAddress(hangarLocation, number);
      setHangarLocation(updatedResult);
      updateFormData({ hangarLocation: updatedResult });
    }
  };


  return (
    <div className="w-full space-y-8">
      {/* Section 1: Hangar Location */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-[rgb(74,94,50)] flex items-center">
          Where's the hangar   <p className="mt-1 text-sm text-gray-600 ml-2">
         (or where do you wish you could park)?
        </p>
        </h2>
       
        
        <AddressAutocomplete
          value={hangarLocation?.street || ''}
          streetNumberValue={hangarLocation?.number || ''}
          onNumberChange={handleHangarNumberChange}
          onNumberBlur={handleHangarNumberBlur}
          onSelect={handleHangarSelect}
          showNumberField={true}
          hasError={fieldErrors?.hangarLocation}
        />
        
        <LocationMap
          coordinates={
            hangarLocation?.coordinates && hangarLocation.coordinates.lat !== 0
              ? hangarLocation.coordinates
              : undefined
          }
          onLocationSelect={handleHangarLocationSelect}
          className="mt-4"
        />
      </div>

      {/* Section 2: Do you use this hangar? */}
      <div>
        <SelectableTagGroup
          label="Do you use this hangar right now?"
          options={['✅ Yes — I have a space', '❌ No — Not yet / Waiting / Nearby rider']}
          selectedOptions={
            formData.usesHangar === true
              ? ['✅ Yes — I have a space']
              : formData.usesHangar === false
              ? ['❌ No — Not yet / Waiting / Nearby rider']
              : []
          }
          onChange={(selected) => {
            const value = selected[0] === '✅ Yes — I have a space' ? true : false;
            updateFormData({ usesHangar: value });
          }}
          multiSelect={false}
          error={fieldErrors?.usesHangar}
        />
      </div>

      {/* Section 3: Your home type */}
      <div>
        <SelectableTagGroup
          label="Where do you live?"
          options={['Flat', 'House', 'Shared housing', 'Something else']}
          selectedOptions={
            formData.homeType === 'flat'
              ? ['Flat']
              : formData.homeType === 'house'
              ? ['House']
              : formData.homeType === 'shared'
              ? ['Shared housing']
              : formData.homeType === 'other'
              ? ['Something else']
              : []
          }
          onChange={(selected) => {
            const value = 
              selected[0] === 'Flat' ? 'flat' :
              selected[0] === 'House' ? 'house' :
              selected[0] === 'Shared housing' ? 'shared' : 'other';
            updateFormData({ homeType: value as FormDataType['homeType'] });
          }}
          multiSelect={false}
          error={fieldErrors?.homeType}
        />
      </div>

      {/* Section 4: Your connection to this hangar */}
      <div>
        <SelectableTagGroup
          label="How do you use this hangar?"
          options={['I rent a space', 'I used to', 'I live near it', 'I park here sometimes']}
          selectedOptions={
            formData.connectionType === 'rent_space'
              ? ['I rent a space']
              : formData.connectionType === 'used_to'
              ? ['I used to']
              : formData.connectionType === 'live_near'
              ? ['I live near it']
              : formData.connectionType === 'park_sometimes'
              ? ['I park here sometimes']
              : []
          }
          onChange={(selected) => {
            const value = 
              selected[0] === 'I rent a space' ? 'rent_space' :
              selected[0] === 'I used to' ? 'used_to' :
              selected[0] === 'I live near it' ? 'live_near' : 'park_sometimes';
            updateFormData({ connectionType: value as FormDataType['connectionType'] });
          }}
          multiSelect={false}
          error={fieldErrors?.connectionType}
        />
      </div>


      {/* Next button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          {...umamiEventProps('review:step1-next')}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Step1ObjectiveData;
