import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { AddressResult } from './ui/AddressAutocomplete';
import ReviewsPanel from './map/ReviewsPanel';
import SearchBar from './map/SearchBar';
import { getPublicReviews, type PublicReview } from '../services/supabase/publicReviews';
import { geocodingService } from './ui/address/geocodingService';
import PublicReviewsLayer from './map/PublicReviewsLayer';
import MapBoundsWatcher from './map/MapBoundsWatcher';
import DetailsPanel from './map/DetailsPanel';
import { useMap } from 'react-leaflet';

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

const MapView = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  // Removed map re-centering selection state to avoid automatic centering
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const [visiblePublic, setVisiblePublic] = useState<PublicReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  // Center/zoom state used with SetViewOnChange to avoid remounts
  const [center, setCenter] = useState<[number, number]>([40.416775, -3.70379]); // Madrid
  const [zoom, setZoom] = useState<number>(14);
  const centerInitialized = useRef(false);
  const geolocationAttempted = useRef(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  // Initialize from query params (?lat=..&lng=..&q=..)
  useEffect(() => {
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const qParam = searchParams.get('q');
    const lat = latParam ? parseFloat(latParam) : NaN;
    const lng = lngParam ? parseFloat(lngParam) : NaN;

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      setCenter([lat, lng]);
      setZoom(17);
      if (mapReady) {
        mapRef.current?.setView([lat, lng], 17, { animate: true });
      }
      centerInitialized.current = true;
      geolocationAttempted.current = true;
      if (qParam) setSearchValue(qParam);
    } else if (qParam && !centerInitialized.current) {
      setSearchValue(qParam);
    }
  }, [searchParams, mapReady]);

  useEffect(() => {
    (async () => {
      const rows = await getPublicReviews();
      setPublicReviews(rows);
      // Optionally center on average of public reviews AFTER geolocation attempt
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
  }, []);

  // Try to center on user's current location on first mount (priority)
  useEffect(() => {
    if (centerInitialized.current) return; // avoid re-running
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setZoom(16);
          // ensure the live map recenters on mount
          mapRef.current?.setView([latitude, longitude], 16, { animate: true });
          setCurrentLocation({ lat: latitude, lng: longitude });
          centerInitialized.current = true;
          geolocationAttempted.current = true;
        },
        () => {
          // keep Madrid fallback
          setCenter([40.416775, -3.70379]);
          setZoom(14);
          mapRef.current?.setView([40.416775, -3.70379], 14, { animate: false });
          centerInitialized.current = true;
          geolocationAttempted.current = true;
        }
      );
    } else {
      setCenter([40.416775, -3.70379]);
      setZoom(14);
      mapRef.current?.setView([40.416775, -3.70379], 14, { animate: false });
      centerInitialized.current = true;
      geolocationAttempted.current = true;
    }
  }, []);

  return (
    <div className="w-full px-6 md:px-8 pt-24 md:pt-28 pb-8">
      <div className="mx-auto max-w-[1800px]">
        <h1 className="text-left text-3xl font-semibold mb-4">Mapa de opiniones</h1>
        <div className="shadow-lg rounded-xl p-4 bg-gray-50">
          <div className="grid md:grid-cols-[360px_1fr] gap-4">
            {/* Sidebar (desktop) */}
            <aside className="hidden md:flex md:flex-col">
              <div className="h-[80vh]">
                <ReviewsPanel
                  reviews={visiblePublic.map(r => ({
                    id: r.id,
                    lat: r.lat ?? undefined,
                    lng: r.lng ?? undefined,
                    texto: r.full_address ?? '—',
                    comment: r.owner_opinion ?? undefined,
                    would_recommend: r.would_recommend ?? undefined,
                  }))}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  selectedId={selectedReview?.id ?? null}
                  onSelect={r => {
                    const match = publicReviews.find(x => String(x.id) === String(r.id));
                    if (match) setSelectedReview(match);
                  }}
                />
              </div>
            </aside>

            {/* Map container */}
            <div className="relative">
              {/* Floating centered Search Bar */}
              <div className="absolute left-1/2 top-6 md:top-8 z-[10] w-[min(640px,92vw)] -translate-x-1/2">
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

              {/* Map */}
              <div className="relative z-0 w-full h-[80vh] rounded-3xl border border-gray-200 overflow-hidden shadow-md bg-white/10">
                <MapContainer
                  center={center}
                  zoom={zoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom
                >
                  <CaptureMapRef
                    onReady={m => {
                      mapRef.current = m;
                      setMapReady(true);
                    }}
                  />
                  <CloseOnMove
                    onMove={() => {
                      setSelectedReview(null);
                      setHoveredId(null);
                      setSearchValue('');
                      setMobileListOpen(false);
                    }}
                  />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maxZoom={19}
                  />

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
                      setSelectedReview(rev);
                      setMobileListOpen(false);
                    }}
                  />
                  <MapBoundsWatcher items={publicReviews} onChange={setVisiblePublic} />
                </MapContainer>
              </div>

              {/* Mobile toggle button for reviews list */}
              <button
                type="button"
                className="md:hidden absolute left-4 bottom-4 z-[1000] rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow"
                onClick={() => setMobileListOpen(true)}
              >
                Opiniones
              </button>

              {/* Right-side details panel overlay (desktop) */}
              {selectedReview && (
                <>
                  <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-[1100] w-[380px] max-w-[86vw]">
                    <div className="rounded-2xl bg-white shadow-xl border overflow-hidden max-h-[70vh]">
                      <DetailsPanel review={selectedReview} onClose={() => setSelectedReview(null)} />
                    </div>
                  </div>

                  {/* Mobile details overlay */}
                  <div className="md:hidden fixed inset-0 z-[1200] bg-black/40">
                    <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-white shadow-xl">
                      <DetailsPanel review={selectedReview} onClose={() => setSelectedReview(null)} />
                    </div>
                  </div>
                </>
              )}

              {/* Mobile reviews list overlay */}
              {mobileListOpen && (
                <div className="md:hidden fixed inset-0 z-[1150] bg-black/40">
                  <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-white shadow-xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-base font-semibold">Opiniones</h2>
                      <button
                        type="button"
                        className="text-xl"
                        aria-label="Cerrar"
                        onClick={() => setMobileListOpen(false)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                      <ReviewsPanel
                        reviews={visiblePublic.map(r => ({
                          id: r.id,
                          lat: r.lat ?? undefined,
                          lng: r.lng ?? undefined,
                          texto: r.full_address ?? '—',
                          comment: r.owner_opinion ?? undefined,
                          would_recommend: r.would_recommend ?? undefined,
                        }))}
                        hoveredId={hoveredId}
                        setHoveredId={setHoveredId}
                        selectedId={selectedReview?.id ?? null}
                        onSelect={r => {
                          const match = publicReviews.find(x => String(x.id) === String(r.id));
                          if (match) setSelectedReview(match);
                          setMobileListOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

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
