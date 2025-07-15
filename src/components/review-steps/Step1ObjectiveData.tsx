import {
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useFormContext } from "../../store/useFormContext";
import AddressAutocomplete, { type AddressResult } from "../ui/AddressAutocomplete";
import CustomInput from "../ui/CustomInput";
import LocationMap from "../ui/LocationMap";
import { useMapLocationHandler } from "./location/mapLocationHandler";
import { geocodingService } from "../ui/address/geocodingService";
import type { AddressDetails } from "../../validation/formValidation";

interface Step1Props {
  onNext: () => void;
  fieldErrors?: {
    street?: boolean;
    number?: boolean;
  };
  isSubmitting?: boolean;
}

export interface Step1Ref {
  getData: () => {
    addressDetails: AddressDetails;
  };
}

const Step1ObjectiveData = forwardRef<Step1Ref, Step1Props>(
  ({ onNext, fieldErrors, isSubmitting = false }, ref) => {
    const { formData, updateFormData } = useFormContext();

    const [addressDetails, setAddressDetails] = useState<AddressDetails>(
      formData.addressDetails || {}
    );

    // Exponer datos al padre
    useImperativeHandle(ref, () => ({
      getData: () => ({
        addressDetails: addressDetails || {},
      }),
    }));

    const handleNumberChange = (number: string) => {
      const updated = { ...addressDetails, number };
      setAddressDetails(updated);
      updateFormData({ addressDetails: updated });
    };

    const handleNumberBlur = async (number: string) => {
      if (
        addressDetails.street &&
        addressDetails.street.trim() !== "" &&
        number.trim() !== ""
      ) {
        const updatedResult = await geocodingService.getCoordinatesForAddress(
          addressDetails,
          number
        );

        const updated: AddressDetails = {
          ...addressDetails,
          number: updatedResult.number,
          coordinates: updatedResult.coordinates,
          fullAddress: updatedResult.fullAddress,
          components: updatedResult.components,
        };

        setAddressDetails(updated);
        updateFormData({
          addressDetails: updated,
        });
      }
    };

    function resultToAddressDetails(r: AddressResult): AddressDetails {
      const c = r.components || {};
      return {
        street: c.road || "",
        number: c.house_number || "",
        city: c.city || c.town || c.village || "",
        postalCode: c.postcode || "",
        state: c.state || "",
        fullAddress: r.formatted || "",
        coordinates: {
          lat: r.geometry.lat,
          lng: r.geometry.lng,
        },
        components: c,
      };
    }

    const handleSelect = (result: AddressResult) => {
      const converted = resultToAddressDetails(result);
      setAddressDetails(converted);
      updateFormData({
        addressDetails: converted,
      });
    };
    

    const handleLocationSelect = useMapLocationHandler((result) => {
      const converted = resultToAddressDetails(result);
      setAddressDetails(converted);
      updateFormData({
        addressDetails: converted,
      });
    });
    

    return (
      <div className="w-full">
        <h3 className="mb-4 text-xl font-medium text-black">Dirección</h3>
        <AddressAutocomplete
          value={addressDetails.street || ""}
          streetNumberValue={addressDetails.number || ""}
          onNumberChange={handleNumberChange}
          onNumberBlur={handleNumberBlur}
          onSelect={handleSelect}
          showNumberField={true}
          hasError={fieldErrors?.street}
          numberHasError={fieldErrors?.number}
        />
        <LocationMap
          coordinates={
            addressDetails.coordinates && addressDetails.coordinates.lat !== 0
              ? addressDetails.coordinates
              : undefined
          }
          onLocationSelect={handleLocationSelect}
          className="mt-2"
        />
        <div className="-mx-2 mt-4 flex">
          <div className="w-1/2 px-2">
            <CustomInput
              id="floor"
              type="text"
              placeholder="Piso"
              value={addressDetails.floor || ""}
              onChange={(e) =>
                setAddressDetails((prev) => ({
                  ...prev,
                  floor: e.target.value,
                }))
              }
            />
          </div>
          <div className="w-1/2 px-2">
            <CustomInput
              id="door"
              type="text"
              placeholder="Puerta"
              value={addressDetails.door || ""}
              onChange={(e) =>
                setAddressDetails((prev) => ({
                  ...prev,
                  door: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="rounded bg-[rgb(74,94,50)] px-6 py-2 text-white hover:bg-[rgb(60,76,40)] disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Siguiente"}
          </button>
        </div>
      </div>
    );
  }
);

export default Step1ObjectiveData;
