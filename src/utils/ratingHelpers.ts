
export const THRESHOLD_EXCELLENT = 3.5;
export const THRESHOLD_POOR = 2.2;

export type RatingTone = 'excellent' | 'average' | 'poor' | 'none';
export type Mood = 'positive' | 'negative' | 'neutral';
export type Face = 'happy' | 'neutral' | 'sad';

/**
 * Calculate security rating for hangar users
 * Formula: Average of (Daytime safety + Nighttime safety + Theft rating)
 * Theft rating: No theft = 5, Theft reported = 2
 */
export const calculateSecurityRating = (
  daytimeSafety: number | null | undefined,
  nighttimeSafety: number | null | undefined,
  hasTheft: boolean | null | undefined
): number | null => {
  const ratings: number[] = [];
  if (typeof daytimeSafety === 'number') ratings.push(daytimeSafety);
  if (typeof nighttimeSafety === 'number') ratings.push(nighttimeSafety);
  
  // Add theft rating: 5 if no theft, 2 if theft reported
  if (typeof hasTheft === 'boolean') {
    const theftRating = hasTheft ? 2 : 5;
    ratings.push(theftRating);
  }
  
  if (ratings.length === 0) return null;
  
  const securityRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  
  return Math.max(0, Math.min(5, securityRating));
};

/**
 * Calculate HangarOK Score - overall rating based on 4 categories
 * Formula: Average of (Community Vibe + Safety Check + Everyday Usability + Maintenance & Support)
 */
export const calculateHangarOKScore = (
  communityVibe: number | null | undefined,
  safetyCheck: number | null | undefined,
  everydayUsability: number | null | undefined,
  maintenanceSupport: number | null | undefined
): number | null => {
  const scores: number[] = [];
  if (typeof communityVibe === 'number') scores.push(communityVibe);
  if (typeof safetyCheck === 'number') scores.push(safetyCheck);
  if (typeof everydayUsability === 'number') scores.push(everydayUsability);
  if (typeof maintenanceSupport === 'number') scores.push(maintenanceSupport);
  
  if (scores.length === 0) return null;
  
  const hangarOKScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  
  return Math.max(0, Math.min(5, hangarOKScore));
};

export const getRatingTone = (score?: number | null): RatingTone => {
  if (typeof score !== 'number' || Number.isNaN(score) || score <= 0) return 'none';
  if (score > THRESHOLD_EXCELLENT) return 'excellent';
  if (score < THRESHOLD_POOR) return 'poor';
  return 'average';
};

/**
 * Rating bar background styles
 */
export const RATING_BAR_STYLES: Record<RatingTone, { background: string; text: string }> = {
  excellent: { background: 'bg-emerald-600', text: 'text-white' },
  average: { background: 'bg-slate-500', text: 'text-white' },
  poor: { background: 'bg-rose-600', text: 'text-white' },
  none: { background: 'bg-gray-600', text: 'text-white' },
};

/**
 * Map marker mood determination (for face icon colors)
 * Uses THRESHOLD_EXCELLENT and THRESHOLD_POOR constants
 */
export const getMood = (rating?: number | null): Mood => {
  if (typeof rating !== 'number') return 'neutral';
  if (rating > THRESHOLD_EXCELLENT) return 'positive';
  if (rating < THRESHOLD_POOR) return 'negative';
  return 'neutral';
};

/**
 * Map marker face determination (for face icon emoji)
 * Uses THRESHOLD_EXCELLENT and THRESHOLD_POOR constants
 */
export const getFace = (rating?: number | null): Face => {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) return 'neutral';
  if (rating < THRESHOLD_POOR) return 'sad';
  if (rating <= THRESHOLD_EXCELLENT) return 'neutral';
  return 'happy';
};
