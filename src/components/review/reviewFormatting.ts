import type { AddressStepData } from '../../services/supabase/GetSubmitStep1';

export const ACCENT = 'rgb(74,94,50)';

export const HOME_TYPE_LABELS: Record<string, string> = {
  flat: 'Flat apartment',
  house: 'House',
  shared: 'Shared home',
  other: 'Other home type',
};

export const CONNECTION_TYPE_LABELS: Record<string, string> = {
  rent_space: 'Rents a space',
  used_to: 'Used to rent',
  live_near: 'Lives nearby',
  park_sometimes: 'Parks occasionally',
};

const OPTION_LABELS: Record<string, string> = {
  not_really: 'Not really',
  yes: 'Yes',
  no: 'No',
  sometimes: 'Sometimes',
  hangar: 'Hangar',
  shed: 'Shed',
  garage: 'Garage',
  street: 'On the street',
  storage_room: 'Storage room',
  indoors: 'Indoors',
  outdoors: 'Outdoors',
};

export const TAG_ICON_MAP: Record<string, string> = {
  cyclists_unwelcome: '🚴',
  out_of_place: '🤔',
  takes_space: '🚗',
  people_moan: '😤',
  more_like_this: '👍',
  people_mock: '😂',
  car_parking_protected: '🚙',
  lock_tempting: '🔓',
  dark_hidden: '🌑',
  people_hang: '👥',
  hangar_damaged: '🔨',
  visible_neighbours: '👁️',
  feels_safe: '✅',
  door_heavy: '🚪',
  lock_jams: '🔒',
  cramped: '😣',
  easy_to_use: '✅',
  usually_clean: '🧹',
  broken_lock: '🔧',
  lighting_out: '💡',
  someone_in_space: '🚲',
  vandalism: '🔨',
  good_at_fixing: '✅',
};

const TITLE_CASE = (value: string) =>
  value
    .replace(/_/g, ' ')
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase();
      const capitalised = lower.charAt(0).toUpperCase() + lower.slice(1);
      if (index === 0) return capitalised;
      return capitalised;
    })
    .join(' ');

export const formatOptionLabel = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const key = trimmed.toLowerCase();
  if (OPTION_LABELS[key]) return OPTION_LABELS[key];
  if (CONNECTION_TYPE_LABELS[key]) return CONNECTION_TYPE_LABELS[key];
  if (HOME_TYPE_LABELS[key]) return HOME_TYPE_LABELS[key];
  if (trimmed.includes(' ')) return trimmed;
  return TITLE_CASE(trimmed);
};

export const formatTagLabel = (tag: string) => {
  const labels: Record<string, string> = {
    cyclists_unwelcome: 'Cyclists unwelcome',
    out_of_place: 'Out of place',
    takes_space: 'Takes car space',
    people_moan: 'People moan',
    more_like_this: 'More like this',
    people_mock: 'People mock it',
    car_parking_protected: 'Cars protected first',
    lock_tempting: 'Tempting to thieves',
    dark_hidden: 'Dark or hidden',
    people_hang: 'People hang around',
    hangar_damaged: 'Hangar damaged',
    visible_neighbours: 'Visible to neighbours',
    feels_safe: 'Feels safe',
    door_heavy: 'Heavy door',
    lock_jams: 'Lock jams',
    cramped: 'Cramped inside',
    easy_to_use: 'Easy to use',
    usually_clean: 'Usually clean',
    broken_lock: 'Broken lock',
    lighting_out: 'Lighting out',
    someone_in_space: 'Someone in a space',
    vandalism: 'Vandalism',
    good_at_fixing: 'Good at fixing',
  };
  return labels[tag] ?? TITLE_CASE(tag);
};

export const formatScore = (value: number) => (Number.isInteger(value) ? value : Number(value.toFixed(1)));

export const average = (values: Array<number | null | undefined>) => {
  const valid = values.filter((value): value is number => typeof value === 'number');
  if (valid.length === 0) return null;
  return Number((valid.reduce((sum, value) => sum + value, 0) / valid.length).toFixed(1));
};

export const formatAddress = (step1Data: AddressStepData | null) => {
  const location = step1Data?.hangar_location;
  if (!location) return 'Hangar review';
  if (location.fullAddress) return location.fullAddress;

  const parts = [location.street, location.number, location.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Hangar review';
};
