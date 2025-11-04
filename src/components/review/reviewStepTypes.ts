export interface Step2Data {
  belongs_rating?: number | null;
  fair_use_rating?: number | null;
  appearance_rating?: number | null;
  perception_tags?: string[];
  community_feedback?: string | null;
}

export interface Step3Data {
  daytime_safety_rating?: number | null;
  nighttime_safety_rating?: number | null;
  bike_messed_with?: boolean | null;
  current_bike_storage?: string | null;
  theft_worry_rating?: number | null;
  safety_tags?: string[];
}

export interface Step4Data {
  lock_ease_rating?: number | null;
  space_rating?: number | null;
  lighting_rating?: number | null;
  maintenance_rating?: number | null;
  usability_tags?: string[];
  improvement_suggestion?: string | null;
  stops_cycling?: string | null;
  impact_tags?: string[];
}

export interface Step5Data {
  report_ease_rating?: number | null;
  fix_speed_rating?: number | null;
  communication_rating?: number | null;
  maintenance_tags?: string[];
  waitlist_fairness_rating?: number | null;
  waitlist_tags?: string[];
  improvement_feedback?: string | null;
}
