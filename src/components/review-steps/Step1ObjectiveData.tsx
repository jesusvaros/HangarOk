import { useEffect, useState } from 'react';
import { useFormContext } from '../../store/useFormContext';
import AddressAutocomplete, { type AddressResult } from '../ui/AddressAutocomplete';
import LocationMap from '../ui/LocationMap';
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
        <h2 className="mb-2 text-2xl font-semibold text-[rgb(74,94,50)]">
          Where's the hangar (or where do you wish you could park)?
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Search for street or hangar number, then pick it on the map
        </p>
        
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
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Do you use this hangar right now?
        </h3>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[rgb(74,94,50)] hover:bg-green-50">
            <input
              type="radio"
              name="usesHangar"
              checked={formData.usesHangar === true}
              onChange={() => updateFormData({ usesHangar: true })}
              className="mr-3 h-5 w-5 text-[rgb(74,94,50)] focus:ring-[rgb(74,94,50)]"
              {...umamiEventProps('review:step1-uses-hangar-yes')}
            />
            <span className="font-medium">✅ Yes — I have a space</span>
          </label>
          
          <label className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[rgb(74,94,50)] hover:bg-green-50">
            <input
              type="radio"
              name="usesHangar"
              checked={formData.usesHangar === false}
              onChange={() => updateFormData({ usesHangar: false })}
              className="mr-3 h-5 w-5 text-[rgb(74,94,50)] focus:ring-[rgb(74,94,50)]"
              {...umamiEventProps('review:step1-uses-hangar-no')}
            />
            <span className="font-medium">❌ No — Not yet / Waiting / Nearby rider</span>
          </label>
        </div>
        {fieldErrors?.usesHangar && (
          <p className="mt-2 text-sm text-red-600">Please select an option</p>
        )}
      </div>

      {/* Section 3: Your home type */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          Where do you live?
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'flat', label: 'Flat' },
            { value: 'house', label: 'House' },
            { value: 'shared', label: 'Shared housing' },
            { value: 'other', label: 'Something else' },
          ].map(option => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-3 transition-all hover:border-[rgb(74,94,50)] hover:bg-green-50"
            >
              <input
                type="radio"
                name="homeType"
                value={option.value}
                checked={formData.homeType === option.value}
                onChange={e => updateFormData({ homeType: e.target.value as FormDataType['homeType'] })}
                className="mr-2 h-4 w-4 text-[rgb(74,94,50)] focus:ring-[rgb(74,94,50)]"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors?.homeType && (
          <p className="mt-2 text-sm text-red-600">Please select your home type</p>
        )}
      </div>

      {/* Section 4: Your connection to this hangar */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-800">
          How do you use this hangar?
        </h3>
        <div className="space-y-2">
          {[
            { value: 'rent_space', label: 'I rent a space' },
            { value: 'used_to', label: 'I used to' },
            { value: 'live_near', label: 'I live near it' },
            { value: 'park_sometimes', label: 'I park here sometimes' },
          ].map(option => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[rgb(74,94,50)] hover:bg-green-50"
            >
              <input
                type="radio"
                name="connectionType"
                value={option.value}
                checked={formData.connectionType === option.value}
                onChange={e => updateFormData({ connectionType: e.target.value as FormDataType['connectionType'] })}
                className="mr-3 h-5 w-5 text-[rgb(74,94,50)] focus:ring-[rgb(74,94,50)]"
                {...umamiEventProps(`review:step1-connection-${option.value}`)}
              />
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
        {fieldErrors?.connectionType && (
          <p className="mt-2 text-sm text-red-600">Please select how you use this hangar</p>
        )}
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
