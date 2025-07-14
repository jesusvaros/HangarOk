// Address types for the AddressAutocomplete component
export type AddressResult = {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
  components: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    [key: string]: string | undefined;
  };
  annotations: {
    geohash: string;
    [key: string]: unknown;
  };
};

export type HereGeocodeItem = {
  address: {
    label?: string;
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    countryName?: string;
  };
  position: {
    lat: number;
    lng: number;
  };
};
