import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageSEO from '../seo/PageSEO';
import MapView from '../components/MapView';
import { getPublicReviews, type PublicReview } from '../services/supabase/publicReviews';
import { slugify } from '../utils/slugify';
import { SegmentedBar } from '../components/ui/SegmentedBar';
import { getRatingTone, RATING_BAR_STYLES } from '../utils/ratingHelpers';
import {
  SparklesIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { faceBubbleSVG } from '../components/map/heroPin';

type Status = 'loading' | 'ready' | 'not-found';
type FaceMood = 'positive' | 'negative' | 'neutral';

const FACE_COLORS: Record<FaceMood, string> = {
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#4B5563',
};

const FaceIcon = ({ face, mood = 'neutral' }: { face: 'happy' | 'neutral' | 'sad'; mood?: FaceMood }) => (
  <span
    className="flex h-5 w-5 flex-shrink-0 items-center justify-center"
    aria-hidden
    dangerouslySetInnerHTML={{
      __html: faceBubbleSVG({ fill: FACE_COLORS[mood], size: 20, face }),
    }}
  />
);

function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function CityReviewsPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [cityName, setCityName] = useState<string>('');
  const [stateName, setStateName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (citySlug) {
      setStatus('loading');
      getPublicReviews()
        .then(rows => {
          if (cancelled) return;

          const filtered = rows.filter(review => {
            const slug =
              review.city_slug ??
              (typeof review.city === 'string' && review.city.length > 0
                ? slugify(review.city)
                : null);
            return slug === citySlug;
          });

          if (filtered.length === 0) {
            setReviews([]);
            setStatus('not-found');
            return;
          }

          const preferred = filtered.find(r => r.city) ?? filtered[0];
          setReviews(filtered);
          setCityName(preferred.city ?? humanizeSlug(citySlug));
          setStateName(preferred.state ?? null);
          setStatus('ready');
        })
        .catch(() => {
          if (!cancelled) {
            setStatus('not-found');
          }
        });
    } else {
      setStatus('not-found');
    }

    return () => {
      cancelled = true;
    };
  }, [citySlug]);

  const reviewCount = reviews.length;
  const fallbackCityName = cityName || (citySlug ? humanizeSlug(citySlug) : 'City');

  // Deterministic random selection based on current day
  const selectedReviews = useMemo(() => {
    if (reviews.length === 0) return [];
    
    // Get current day as seed (YYYY-MM-DD format)
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Simple seeded random function
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    
    // Shuffle array with seeded random
    const shuffled = [...reviews];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(4, shuffled.length));
  }, [reviews]);

  const initialView = useMemo(() => {
    if (!reviews.length) return undefined;
    const coords = reviews
      .map(review =>
        typeof review.lat === 'number' && typeof review.lng === 'number'
          ? ([review.lat, review.lng] as [number, number])
          : null
      )
      .filter(Boolean) as [number, number][];

    if (coords.length === 0) return undefined;

    const avg = coords.reduce(
      (acc, value) => {
        acc[0] += value[0];
        acc[1] += value[1];
        return acc;
      },
      [0, 0]
    );
    const lat = avg[0] / coords.length;
    const lng = avg[1] / coords.length;
    const zoom = coords.length <= 1 ? 16 : 14;
    const searchLabel = stateName ? `${fallbackCityName}, ${stateName}` : fallbackCityName;

    return {
      center: [lat, lng] as [number, number],
      zoom,
      searchLabel,
    };
  }, [reviews, fallbackCityName, stateName]);

  const heroSubtitle =
    reviewCount === 1
      ? `We have 1 published review about cycle hangars in ${fallbackCityName}.`
      : `We have ${reviewCount} published reviews about cycle hangars in ${fallbackCityName}.`;

  const seoTitle = `Hangar reviews in ${fallbackCityName} | HangarOK`;
  const seoDescription =
    reviewCount > 0
      ? `Discover ${reviewCount === 1 ? 'the review' : `${reviewCount} reviews`} from riders about landlords and homes in ${fallbackCityName}${
          stateName ? `, ${stateName}` : ''
        }.`
      : `Discover renter opinions about landlords and homes in ${fallbackCityName}.`;

  return (
    <>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonicalPath={citySlug ? `/opiniones/${citySlug}` : undefined}
        noindex={status === 'not-found'}
      />
      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        {status === 'loading' ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              City reviews
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              Hangar reviews in {fallbackCityName}
            </h1>
            <p className="mt-4 text-gray-600">Loading details and map…</p>
          </section>
        ) : null}

        {status === 'not-found' ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              City reviews
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">
              We couldn’t find reviews for {fallbackCityName}
            </h1>
            <p className="mt-4 text-gray-600">
              We don’t have public reviews for this location yet. You can explore every review on the
              main map or head back to the list of available cities.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/map"
                className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                View full map
              </Link>
              <Link
                to="/opiniones"
                className="rounded-full border border-emerald-700 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                View cities with reviews
              </Link>
            </div>
          </section>
        ) : null}

        {status === 'ready' ? (
          <>
            <header className="mb-12 text-center md:text-left">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                City reviews
              </p>
              <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                Hangar reviews in {formatCityWithState(fallbackCityName, stateName)}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-gray-600 md:mt-3">{heroSubtitle}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <Link
                  to="/map"
                  className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  View full map
                </Link>
                <Link
                  to="/opiniones"
                  className="rounded-full border border-emerald-700 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  View all cities
                </Link>
              </div>
            </header>

            <section className="mb-12">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  What riders say about {fallbackCityName}
                </h2>
                <p className="mt-3 text-sm text-gray-600">
                  We’ve highlighted real testimonies so you can understand the cycle hangar experience in this area.
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {selectedReviews.map(review => {
                    // Calculate category ratings for hangar users
                    const isHangarUser = review.uses_hangar === true;
                    
                    if (!isHangarUser) {
                      return (
                        <Link
                          key={review.id}
                          to={`/review/${review.id}`}
                          className="block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
                              {review.full_address ?? fallbackCityName}
                            </p>
                            <p className="text-sm text-gray-700">
                              {review.waitlist_fairness_rating ? `Access fairness: ${review.waitlist_fairness_rating.toFixed(1)}/5` : 'Review pending completion.'}
                            </p>
                          </div>
                        </Link>
                      );
                    }
                    
                    // Calculate 4 main categories for hangar users
                    const communityVibe = (review.belongs_rating != null && review.fair_use_rating != null && review.appearance_rating != null)
                      ? (review.belongs_rating + review.fair_use_rating + review.appearance_rating) / 3
                      : null;
                    
                    const maintenanceSupport = (review.report_ease_rating != null && review.fix_speed_rating != null && review.communication_rating != null)
                      ? (review.report_ease_rating + review.fix_speed_rating + review.communication_rating) / 3
                      : null;
                    
                    type CategoryItem = { name: string; icon: typeof SparklesIcon; value: number };
                    const categories = [
                      { name: 'Community Vibe', icon: SparklesIcon, value: communityVibe },
                      { name: 'Safety Check', icon: ShieldCheckIcon, value: review.overall_safety_rating },
                      { name: 'Everyday Usability', icon: CogIcon, value: review.overall_usability_rating },
                      { name: 'Maintenance & Support', icon: WrenchScrewdriverIcon, value: maintenanceSupport },
                    ].filter((c): c is CategoryItem => c.value != null);
                    
                    if (categories.length < 2) {
                      return (
                        <Link
                          key={review.id}
                          to={`/review/${review.id}`}
                          className="block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="p-5">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
                              {review.full_address ?? fallbackCityName}
                            </p>
                            <p className="text-sm text-gray-700">Review pending completion.</p>
                          </div>
                        </Link>
                      );
                    }
                    
                    const sorted = [...categories].sort((a, b) => b.value - a.value);
                    const best = sorted[0];
                    const worst = sorted[sorted.length - 1];
                    const worstIsPerfect = worst.value >= 4.95;
                    
                    // Get rating tone for color bar
                    const hangarokScore = review.hangarok_score;
                    const ratingTone = hangarokScore ? getRatingTone(hangarokScore) : 'none';
                    const colorBarStyles = RATING_BAR_STYLES[ratingTone];
                    
                    return (
                      <Link
                        key={review.id}
                        to={`/review/${review.id}`}
                        className="block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Color bar at top */}
                        {hangarokScore && <div className={`${colorBarStyles.background} h-2`} />}
                        
                        <div className="p-5">
                          {/* Address at top */}
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-4">
                            {review.full_address ?? fallbackCityName}
                          </p>
                          
                          {/* HangarOK Score */}
                          {hangarokScore && (
                            <div className="mb-4">
                              <span className="text-xs font-medium text-slate-600">HangarOK Score</span>
                              <SegmentedBar value={hangarokScore} color="rgb(74,94,50)" />
                            </div>
                          )}
                          
                          {/* Best and Worst Categories */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FaceIcon face="happy" mood="positive" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Best</p>
                                <p className="text-xs font-semibold text-slate-800 truncate">{best.name}</p>
                                <SegmentedBar value={best.value} color="rgb(74,94,50)" showValue={false} />
                              </div>
                            </div>
                            
                            {worstIsPerfect ? (
                              <div className="flex items-center gap-2">
                                <FaceIcon face="happy" mood="positive" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Worst</p>
                                  <p className="text-xs font-semibold text-slate-800">No bad here — every category is top rated.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <FaceIcon face="sad" mood="negative" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Worst</p>
                                  <p className="text-xs font-semibold text-slate-800 truncate">{worst.name}</p>
                                  <SegmentedBar value={worst.value} color="rgb(239,68,68)" showValue={false} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {initialView ? (
              <MapView
                title={`Review map for ${formatCityWithState(fallbackCityName, stateName)}`}
                subtitle={heroSubtitle}
                initialViewOverride={initialView}
                reviews={reviews}
                autoFetch={false}
              />
            ) : (
              <section className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                  We can’t show the map for {fallbackCityName} yet
                </h2>
                <p className="mt-3 text-gray-600">
                  The available reviews don’t include precise coordinates yet. Check the main map to see every review.
                </p>
                <Link
                  to="/map"
                  className="mt-6 inline-flex items-center rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Open main map
                </Link>
              </section>
            )}
          </>
        ) : null}
      </main>
    </>
  );
}

function formatCityWithState(city: string, stateName: string | null) {
  return stateName ? `${city}, ${stateName}` : city;
}
