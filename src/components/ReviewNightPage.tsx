import { useEffect } from 'react';
import { trackUmamiEvent } from '../utils/analytics';
import ReviewNightHero from './review-night/ReviewNightHero';
import ReviewNightWhyItMatters from './review-night/ReviewNightWhyItMatters';
import ReviewNightVisualProof from './review-night/ReviewNightVisualProof';
import ReviewNightSicilyExperience from './review-night/ReviewNightSicilyExperience';
import ReviewNightParticipation from './review-night/ReviewNightParticipation';
import ReviewNight2026Experiences from './review-night/ReviewNight2026Experiences';
import ReviewNightFinalCTA from './review-night/ReviewNightFinalCTA';

const ReviewNightPage = () => {
  useEffect(() => {
    trackUmamiEvent('review-night:page-view');
  }, []);

  return (
    <>
      <ReviewNightHero />
      <ReviewNightWhyItMatters />
      <ReviewNightVisualProof />
      <ReviewNightSicilyExperience />
      <ReviewNightParticipation />
      <ReviewNight2026Experiences />
      <ReviewNightFinalCTA />
    </>
  );
};

export default ReviewNightPage;
