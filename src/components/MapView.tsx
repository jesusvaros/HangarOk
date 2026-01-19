import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, Marker, ZoomControl } from 'react-leaflet';
import MapLibreLayer from './map/MapLibreLayer';
import { useSearchParams } from 'react-router-dom';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AddressResult } from './ui/AddressAutocomplete';
import ReviewsPanel, { type ReviewListItem } from './map/ReviewsPanel';
import SearchBar from './map/SearchBar';
import { getPublicReviews, type PublicReview } from '../services/supabase/publicReviews';
import { geocodingService } from './ui/address/geocodingService';
import PublicReviewsLayer from './map/PublicReviewsLayer';
import MapBoundsWatcher from './map/MapBoundsWatcher';
import DetailsPanel from './map/DetailsPanel';
import { useMap } from 'react-leaflet';
import { trackUmamiEvent } from '../utils/analytics';

type MapViewProps = {
  title?: string;
  subtitle?: string;
  initialViewOverride?: {
    center: [number, number];
    zoom?: number;
    searchLabel?: string;
  };
  reviews?: PublicReview[];
  autoFetch?: boolean;
};

// Helper to capture the Leaflet map instance from inside MapContainer
const CaptureMapRef = ({ onReady }: { onReady: (m: LeafletMap) => void }) => {
  const map = useMap();
  useEffect(() => {
    onReady(map as unknown as LeafletMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);
  return null;
};

// Close panel / clear search on map interactions
const CloseOnMove = ({ onMove }: { onMove: () => void }) => {
  const map = useMap();
  useEffect(() => {
    const handler = () => onMove();
    map.on('dragstart', handler);
    map.on('zoomstart', handler);
    map.on('movestart', handler);
    return () => {
      map.off('dragstart', handler);
      map.off('zoomstart', handler);
      map.off('movestart', handler);
    };
  }, [map, onMove]);
  return null;
};

const MapView = ({
  title = 'Hangar Reviews Map',
  subtitle,
  initialViewOverride,
  reviews,
  autoFetch = reviews === undefined,
}: MapViewProps = {}) => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState(initialViewOverride?.searchLabel ?? '');
  // Removed map re-centering selection state to avoid automatic centering
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>(reviews ?? []);
  const [visiblePublic, setVisiblePublic] = useState<PublicReview[]>(reviews ?? []);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);
  const [groupSelection, setGroupSelection] = useState<{
    hangarKey: string;
    hangarLabel: string;
    reviews: PublicReview[];
    index: number;
  } | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  // Center/zoom state used with SetViewOnChange to avoid remounts
  const [center, setCenter] = useState<[number, number]>(
    initialViewOverride?.center ?? [51.507351, -0.127758]
  ); // London
  const [zoom, setZoom] = useState<number>(initialViewOverride?.zoom ?? 16);
  const centerInitialized = useRef(false);
  const geolocationAttempted = useRef(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const LAST_VIEW_KEY = 'map:lastView';

  const currentIcon = L.divIcon({
    className: '',
    html: `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="6" fill="#3B82F6" stroke="#FFFFFF" stroke-width="2" />
</svg>
`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const groupedListItems = useMemo<ReviewListItem[]>(() => {
    if (!visiblePublic.length) return [];

    const hangarGroups = new Map<string, PublicReview[]>();
    visiblePublic.forEach(review => {
      const key = review.hangar_number?.trim();
      if (!key) return;
      const existing = hangarGroups.get(key) ?? [];
      existing.push(review);
      hangarGroups.set(key, existing);
    });

    const processedHangars = new Set<string>();
    const result: ReviewListItem[] = [];

    visiblePublic.forEach(review => {
      const key = review.hangar_number?.trim();
      const group = key ? hangarGroups.get(key) ?? [] : [];
      if (key && group.length > 1) {
        if (processedHangars.has(key)) return;
        processedHangars.add(key);

        const usabilityScores = group
          .map(candidate =>
            typeof candidate.overall_usability_rating === 'number' ? candidate.overall_usability_rating : null
          )
          .filter((score): score is number => score != null);

        const averageUsability =
          usabilityScores.length > 0
            ? usabilityScores.reduce((sum, score) => sum + score, 0) / usabilityScores.length
            : undefined;

        const primaryReview = group.find(
          candidate => typeof candidate.full_address === 'string' && candidate.full_address.length > 0
        );
        const representative = group[0];

        result.push({
          id: `group-${key}`,
          lat: representative?.lat ?? undefined,
          lng: representative?.lng ?? undefined,
          texto: primaryReview?.full_address ?? `Hangar ${key}`,
          hangarok_score: null,
          usability_rating: averageUsability,
          uses_hangar: null,
          hangar_number: key,
          groupCount: group.length,
          groupedIds: group.map(candidate => candidate.id),
          groupedReviews: group.map(candidate => ({
            id: candidate.id,
            full_address: candidate.full_address ?? null,
            uses_hangar: candidate.uses_hangar ?? null,
            hangar_access_status: candidate.hangar_access_status ?? null,
            overall_safety_rating: candidate.overall_safety_rating ?? null,
            overall_usability_rating: candidate.overall_usability_rating ?? null,
            hangarok_score: candidate.hangarok_score ?? null,
            hangar_number: candidate.hangar_number ?? key,
            theft_worry_rating: candidate.theft_worry_rating ?? null,
            waitlist_fairness_rating: candidate.waitlist_fairness_rating ?? null,
            belongs_rating: candidate.belongs_rating ?? null,
            fair_use_rating: candidate.fair_use_rating ?? null,
            appearance_rating: candidate.appearance_rating ?? null,
            perception_tags: candidate.perception_tags ?? null,
            impact_tags: candidate.impact_tags ?? null,
            waitlist_tags: candidate.waitlist_tags ?? null,
            bike_messed_with: typeof candidate.bike_messed_with === 'boolean' ? candidate.bike_messed_with : null,
          })),
          bike_messed_with: group.some(candidate => candidate.bike_messed_with === true),
        });
      } else {
        result.push({
          id: review.id,
          lat: review.lat ?? undefined,
          lng: review.lng ?? undefined,
          texto: review.full_address ?? '-',
          hangarok_score: review.hangarok_score ?? null,
          usability_rating: review.overall_usability_rating ?? undefined,
          uses_hangar: review.uses_hangar ?? null,
          hangar_access_status: review.hangar_access_status ?? null,
          hangar_number: review.hangar_number ?? null,
          theft_worry_rating: review.theft_worry_rating ?? null,
          waitlist_fairness_rating: review.waitlist_fairness_rating ?? null,
          belongs_rating: review.belongs_rating ?? null,
          fair_use_rating: review.fair_use_rating ?? null,
          appearance_rating: review.appearance_rating ?? null,
          perception_tags: review.perception_tags ?? null,
          impact_tags: review.impact_tags ?? null,
          waitlist_tags: review.waitlist_tags ?? null,
          connection_type: review.connection_type ?? null,
          current_bike_storage: review.current_bike_storage ?? null,
          stops_cycling: review.stops_cycling ?? null,
          bike_messed_with: typeof review.bike_messed_with === 'boolean' ? review.bike_messed_with : null,
        });
      }
    });

    return result;
  }, [visiblePublic]);

  const normalizeHangarNumber = (value?: string | null) => (value ?? '').trim();

  const openGroupForHangar = (hangarKey: string, preferredId?: string | number) => {
    if (!hangarKey) return;
    const related = visiblePublic.filter(
      candidate => normalizeHangarNumber(candidate.hangar_number) === hangarKey
    );
    if (related.length === 0) return;
    const label =
      related.find(candidate => typeof candidate.hangar_number === 'string')?.hangar_number ??
      hangarKey;
    const initialIndex =
      preferredId !== undefined
        ? related.findIndex(candidate => String(candidate.id) === String(preferredId))
        : 0;
    const index = initialIndex >= 0 ? initialIndex : 0;
    setGroupSelection({
      hangarKey,
      hangarLabel: label,
      reviews: related,
      index,
    });
    setSelectedReview(related[index]);
  };

  const handleSelectSingleReview = (review: PublicReview | null) => {
    if (!review) {
      setSelectedReview(null);
      setGroupSelection(null);
      return;
    }

    setSelectedReview(review);

    const key = normalizeHangarNumber(review.hangar_number);
    if (!key) {
      setGroupSelection(null);
      return;
    }

    const related = visiblePublic.filter(
      candidate => normalizeHangarNumber(candidate.hangar_number) === key
    );
    if (related.length > 1) {
      const index = related.findIndex(candidate => String(candidate.id) === String(review.id));
      setGroupSelection({
        hangarKey: key,
        hangarLabel: review.hangar_number ?? key,
        reviews: related,
        index: index >= 0 ? index : 0,
      });
    } else {
      setGroupSelection(null);
    }
  };

  const handleGroupIndexChange = (nextIndex: number) => {
    setGroupSelection(prev => {
      if (!prev) return prev;
      if (prev.reviews.length === 0) return null;
      const clamped = Math.max(0, Math.min(nextIndex, prev.reviews.length - 1));
      if (clamped === prev.index) return prev;
      const nextReview = prev.reviews[clamped];
      if (!nextReview) return prev;
      setSelectedReview(nextReview);
      return {
        ...prev,
        index: clamped,
      };
    });
  };

  const selectedListId: string | number | null = groupSelection
    ? `group-${groupSelection.hangarKey}`
    : selectedReview?.id ?? null;

  const detailsGroupContext =
    groupSelection && groupSelection.reviews.length > 1
      ? {
          index: groupSelection.index,
          total: groupSelection.reviews.length,
          hangarLabel: groupSelection.hangarLabel,
          onSelectIndex: handleGroupIndexChange,
        }
      : undefined;

  // Initialize map center on mount with priority: override -> query params -> localStorage -> geolocation -> default
  useEffect(() => {
    if (!mapReady) return;

    if (initialViewOverride) {
      const nextCenter = initialViewOverride.center;
      const nextZoom = initialViewOverride.zoom ?? 14;
      setCenter(nextCenter);
      setZoom(nextZoom);
      mapRef.current?.setView(nextCenter, nextZoom, { animate: false });
      if (initialViewOverride.searchLabel) {
        setSearchValue(initialViewOverride.searchLabel);
      }
      geolocationAttempted.current = true;
      if (!centerInitialized.current) {
        centerInitialized.current = true;
      }
      return;
    }

    if (centerInitialized.current) return;

    // 1) Query params (?lat=..&lng=..&q=..)
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const qParam = searchParams.get('q');
    const lat = latParam ? parseFloat(latParam) : NaN;
    const lng = lngParam ? parseFloat(lngParam) : NaN;
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      setCenter([lat, lng]);
      setZoom(17);
      mapRef.current?.setView([lat, lng], 17, { animate: true });
      centerInitialized.current = true;
      geolocationAttempted.current = true;
      if (qParam) setSearchValue(qParam);
      return;
    } else if (qParam && !centerInitialized.current) {
      setSearchValue(qParam);
    }

    // 2) Local storage
    try {
      const raw = localStorage.getItem(LAST_VIEW_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { lat: number; lng: number; zoom: number } | null;
        if (
          parsed &&
          typeof parsed.lat === 'number' &&
          typeof parsed.lng === 'number' &&
          typeof parsed.zoom === 'number'
        ) {
          setCenter([parsed.lat, parsed.lng]);
          setZoom(parsed.zoom);
          mapRef.current?.setView([parsed.lat, parsed.lng], parsed.zoom, { animate: false });
          centerInitialized.current = true;
          return;
        }
      }
    } catch (err) {
      // ignore malformed storage
      void err;
    }

    // 3) Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setZoom(16);
          mapRef.current?.setView([latitude, longitude], 16, { animate: true });
          setCurrentLocation({ lat: latitude, lng: longitude });
          centerInitialized.current = true;
          geolocationAttempted.current = true;
        },
        () => {
          // 4) Default fallback: London
          setCenter([51.507351, -0.127758]);
          setZoom(16);
          mapRef.current?.setView([51.507351, -0.127758], 16, { animate: false });
          centerInitialized.current = true;
          geolocationAttempted.current = true;
        }
      );
    } else {
      // 4) Default fallback: London
      setCenter([51.507351, -0.127758]);
      setZoom(16);
      mapRef.current?.setView([51.507351, -0.127758], 16, { animate: false });
      centerInitialized.current = true;
      geolocationAttempted.current = true;
    }
  }, [mapReady, searchParams, initialViewOverride]);

  // Persist view on move/zoom
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const m = mapRef.current;
    const save = () => {
      const c = m.getCenter();
      const z = m.getZoom();
      try {
        localStorage.setItem(
          LAST_VIEW_KEY,
          JSON.stringify({ lat: c.lat, lng: c.lng, zoom: z })
        );
      } catch (err) {
        // ignore storage quota/access errors
        void err;
      }
    };
    m.on('moveend', save);
    m.on('zoomend', save);
    return () => {
      m.off('moveend', save);
      m.off('zoomend', save);
    };
  }, [mapReady]);

  useEffect(() => {
    if (reviews !== undefined) {
      setPublicReviews(reviews);
      setVisiblePublic(reviews);
      return;
    }
    if (!autoFetch) return;

    (async () => {
      const rows = await getPublicReviews();
      setPublicReviews(rows);
      setVisiblePublic(rows);
      if (!centerInitialized.current && geolocationAttempted.current && rows.length > 0) {
        const valid = rows.filter(
          (r): r is PublicReview & { lat: number; lng: number } =>
            typeof r.lat === 'number' && typeof r.lng === 'number'
        );
        if (valid.length > 0) {
          const lat = valid.reduce((s, r) => s + r.lat, 0) / valid.length;
          const lng = valid.reduce((s, r) => s + r.lng, 0) / valid.length;
          setCenter([lat, lng]);
          centerInitialized.current = true;
        }
      }
    })();
  }, [autoFetch, reviews]);

  useEffect(() => {
    if (initialViewOverride?.searchLabel) {
      setSearchValue(initialViewOverride.searchLabel);
    }
  }, [initialViewOverride]);

  

  return (
    <div className="w-full px-0 md:px-8 pt-24 md:pt-28 pb-0 md:pb-8">
      <div className="mx-auto max-w-[1800px]">
        {title ? (
          <div className="hidden md:block mb-4">
            <h1 className="text-left text-3xl font-semibold text-gray-900">{title}</h1>
            {subtitle ? <p className="mt-1 text-base text-gray-600">{subtitle}</p> : null}
          </div>
        ) : null}
        <div className="rounded-none md:rounded-xl md:shadow-lg md:p-4 bg-transparent md:bg-gray-50">
          <div className="grid md:grid-cols-[360px_1fr] gap-4">
            {/* Sidebar (desktop) */}
            <aside className="hidden md:flex md:flex-col">
              <div className="h-[80vh]">
                <ReviewsPanel
                  reviews={groupedListItems}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  selectedId={selectedListId}
                  onSelect={item => {
                    const isGroup = Boolean(item.groupCount && item.groupCount > 1 && item.hangar_number);
                    trackUmamiEvent('map:list-select', {
                      hasSafetyRating: isGroup
                        ? Boolean(item.hangarok_score)
                        : Boolean(
                            publicReviews.find(x => String(x.id) === String(item.id))?.hangarok_score
                          ),
                      grouped: isGroup,
                    });

                    if (isGroup && item.hangar_number) {
                      openGroupForHangar(normalizeHangarNumber(item.hangar_number));
                      return;
                    }

                    const match = publicReviews.find(x => String(x.id) === String(item.id));
                    if (match) {
                      handleSelectSingleReview(match);
                    }
                  }}
                />
              </div>
            </aside>

            {/* Map container */}
            <div className="relative mt-[-35px] md:mt-0">
              {/* Map */}
              <div className="relative  z-0 w-full h-[calc(100vh-60px)] md:h-[80vh] md:rounded-3xl md:border md:border-gray-200 overflow-hidden md:shadow-md bg-white/10">
                {/* Floating centered Search Bar (all breakpoints) - inside map perimeter */}
                <div className="absolute top-3 md:top-6 left-3 right-3 md:left-6 md:right-6 z-[1001] max-w-[640px] mx-auto">
                  <SearchBar
                    value={searchValue}
                    onSelect={(result: AddressResult) => {
                      setSearchValue(result.formatted || '');
                      setError(null);
                      const lat = result.geometry?.lat;
                      const lng = result.geometry?.lng;
                      if (typeof lat === 'number' && typeof lng === 'number') {
                        setCenter([lat, lng]);
                        setZoom(17);
                        mapRef.current?.setView([lat, lng], 17, { animate: true });
                      }
                    }}
                    onLocate={() => {
                      if (!navigator.geolocation) return;
                      navigator.geolocation.getCurrentPosition(
                        pos => {
                          const { latitude, longitude } = pos.coords;
                          setCurrentLocation({ lat: latitude, lng: longitude });
                          setCenter([latitude, longitude]);
                          setZoom(16);
                          mapRef.current?.setView([latitude, longitude], 16, { animate: true });
                          // Reverse geocode to fill the search field with current address
                          geocodingService
                            .reverseGeocode(latitude, longitude)
                            .then(addr => {
                              if (addr?.formatted) setSearchValue(addr.formatted);
                            })
                            .catch(() => {});
                        },
                        () => {
                          // ignore errors silently; user may have denied permissions
                        }
                      );
                    }}
                    onUserInput={v => setSearchValue(v)}
                    allowBroadResults
                  />
                </div>
                <MapContainer
                  center={center}
                  zoom={zoom}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom
                >
                  <ZoomControl position="bottomright" />
                  <CaptureMapRef
                    onReady={m => {
                      mapRef.current = m;
                      setMapReady(true);
                    }}
                  />
                  <CloseOnMove
                    onMove={() => {
                      handleSelectSingleReview(null);
                      setHoveredId(null);
                      setSearchValue('');
                      setMobileListOpen(false);
                    }}
                  />
                  <MapLibreLayer />

                  {currentLocation && (
                    <Marker
                      position={[currentLocation.lat, currentLocation.lng]}
                      icon={currentIcon}
                      zIndexOffset={300}
                    />
                  )}

                  <PublicReviewsLayer
                    reviews={publicReviews}
                    selectedId={selectedReview?.id ?? null}
                    onSelect={(rev: PublicReview) => {
                      const hangarKey = normalizeHangarNumber(rev.hangar_number);
                      const relatedInView = hangarKey
                        ? visiblePublic.filter(
                            candidate => normalizeHangarNumber(candidate.hangar_number) === hangarKey
                          )
                        : [];
                      trackUmamiEvent('map:marker-select', {
                        hasSafetyRating: Boolean(rev.overall_safety_rating),
                        grouped: relatedInView.length > 1,
                      });

                      if (hangarKey && relatedInView.length > 1) {
                        openGroupForHangar(hangarKey, rev.id);
                      } else {
                        handleSelectSingleReview(rev);
                      }
                      setMobileListOpen(false);
                    }}
                  />
                  <MapBoundsWatcher items={publicReviews} onChange={setVisiblePublic} />
                </MapContainer>
              </div>

              {/* Mobile bottom sheet handle to open reviews list */}
              {!mobileListOpen && (
                <button
                  type="button"
                  className="md:hidden absolute left-1/2 bottom-3 z-[1000] -translate-x-1/2 rounded-full bg-white/90 px-4 py-1 text-xs font-medium shadow border"
                  onClick={() => {
                    trackUmamiEvent('map:mobile-open-list');
                    setMobileListOpen(true);
                  }}
                  aria-label="Open reviews"
                >
                  <span className="block h-1.5 w-8 rounded-full bg-gray-400" />
                </button>
              )}

              {/* Right-side details panel overlay (desktop) */}
              {selectedReview && (
                <>
                  <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-[999] w-[320px] max-w-[80vw]">
                      <DetailsPanel
                        review={selectedReview}
                        onClose={() => {
                          handleSelectSingleReview(null);
                        }}
                        groupContext={detailsGroupContext}
                      />
                  
                  </div>

                  {/* Mobile details overlay with animation, positioned over the map (absolute) */}
                  <AnimatePresence>
                    <div className="md:hidden absolute inset-x-0 bottom-0 z-[1200] pointer-events-none">
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute bottom-0 left-0 right-0 max-h-[75vh] rounded-t-2xl bg-white shadow-xl pointer-events-auto flex flex-col"
                      >
                        <DetailsPanel
                          review={selectedReview}
                          onClose={() => {
                            handleSelectSingleReview(null);
                          }}
                          groupContext={detailsGroupContext}
                        />
                      </motion.div>
                    </div>
                  </AnimatePresence>
                </>
              )}

              {/* Mobile reviews list overlay */}
              <AnimatePresence>
                {mobileListOpen && (
                  <div className="md:hidden absolute inset-x-0 bottom-0 z-[1150] pointer-events-none">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute bottom-0 left-0 right-0 max-h-[40vh] rounded-t-2xl bg-white shadow-xl p-4 flex flex-col pointer-events-auto"
                    >
                      <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-gray-300" />
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base font-semibold">Reviews</h2>
                        <button
                          type="button"
                          className="text-xl"
                          aria-label="Close"
                          onClick={() => {
                            trackUmamiEvent('map:mobile-close-list');
                            setMobileListOpen(false);
                          }}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto">
                        <ReviewsPanel
                          reviews={groupedListItems}
                          hoveredId={hoveredId}
                          setHoveredId={setHoveredId}
                          selectedId={selectedListId}
                          onSelect={item => {
                            const isGroup = Boolean(
                              item.groupCount && item.groupCount > 1 && item.hangar_number
                            );
                            trackUmamiEvent('map:list-select', {
                              hasSafetyRating: isGroup
                                ? Boolean(item.hangarok_score)
                                : Boolean(
                                    publicReviews.find(x => String(x.id) === String(item.id))
                                      ?.hangarok_score
                                  ),
                              grouped: isGroup,
                            });

                            if (isGroup && item.hangar_number) {
                              openGroupForHangar(normalizeHangarNumber(item.hangar_number));
                            } else {
                              const match = publicReviews.find(
                                x => String(x.id) === String(item.id)
                              );
                              if (match) {
                                handleSelectSingleReview(match);
                              }
                            }
                            setMobileListOpen(false);
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Error toast */}
              {error && (
                <div className="absolute left-1/2 top-[92px] -translate-x-1/2 z-[1000] rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 shadow">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
