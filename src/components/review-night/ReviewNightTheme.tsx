// Review Night Theme Configuration
export const reviewNightTheme = {
  // Primary brand colors
  primary: '#4A5E32',      // Main green (HangarOK brand)
  primaryHover: '#3B4C28', // Darker green for hover states
  
  // Review Night accent color
  accent: '#DBA400',      // Gold/amber accent
  accentLight: '#F4D03F', // Lighter version for backgrounds
  accentDark: '#B8941F',  // Darker version for text
  
  // Neutral colors
  textPrimary: '#232C17',  // Main text color
  textSecondary: '#4B5563', // Secondary text (darker gray)
  textLight: '#9CA3AF',   // Light text
  
  // Background colors
  bgWhite: '#FFFFFF',
  bgGray: '#F9FAFB',      // Light gray background
  bgDark: '#1A1F14',      // Dark section background
  bgCard: '#FFFFFF',      // Card background
  
  // Gradients
  gradientGreen: 'linear-gradient(135deg, #4A5E32 0%, #232C17 100%)',
  gradientGold: 'linear-gradient(135deg, #DBA400 0%, #B8941F 100%)',
  
  // Border colors
  border: '#E5E7EB',      // Light borders
  borderDark: '#D1D5DB',  // Darker borders
  
  // Semantic colors
  info: '#3B82F6',        // Blue for info
  success: '#10B981',     // Green for success
  warning: '#F59E0B',     // Warning color
};

// Helper function to get theme colors
export const getReviewNightColor = (colorName: keyof typeof reviewNightTheme) => {
  return reviewNightTheme[colorName];
};
