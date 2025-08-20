import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { RecenterOnSelect } from './map/RecenterOnSelect';
import OpinionsLayer from './map/OpinionsLayer';
import { useSearchParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { getOpinionsByCaseroHash } from '../supabaseClient';
import type { Opinion } from '../supabaseClient';
import { calculateHash, generateRandomCoordinates } from '../utils';
import type { AddressResult } from './ui/AddressAutocomplete';
import ReviewsPanel from './map/ReviewsPanel';
import SearchBar from './map/SearchBar';
import { getPublicReviews, type PublicReview } from '../services/supabase/publicReviews';
import PublicReviewsLayer from './map/PublicReviewsLayer';
import MapBoundsWatcher from './map/MapBoundsWatcher';
import DetailsPanel from './map/DetailsPanel';

const MapView = () => {
  const [searchParams] = useSearchParams();
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [publicReviews, setPublicReviews] = useState<PublicReview[]>([]);
  const [visiblePublic, setVisiblePublic] = useState<PublicReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<PublicReview | null>(null);

  // Get caseroId from URL params
  const caseroId = searchParams.get('caseroId');

  // Center/zoom state used with SetViewOnChange to avoid remounts
  const [center, setCenter] = useState<[number, number]>([40.416775, -3.70379]); // Madrid
  const [zoom, setZoom] = useState<number>(14);
  const centerInitialized = useRef(false);

  // Load opinions when caseroId changes
  useEffect(() => {
    const fetchOpinions = async () => {
      if (!caseroId) return;

      setError(null);

      try {
        // Calculate hash of caseroId for privacy
        const hash = await calculateHash(caseroId);
        const fetchedOpinions = await getOpinionsByCaseroHash(hash);

        // Add random coordinates to opinions without location
        const opinionsWithCoords = fetchedOpinions.map(opinion => {
          if (!opinion.lat || !opinion.lng) {
            const coords = generateRandomCoordinates();
            return { ...opinion, lat: coords.lat, lng: coords.lng };
          }
          return opinion;
        });

        setOpinions(opinionsWithCoords);

        // Initialize center once based on fetched opinions to avoid repeated re-centers
        if (!centerInitialized.current && opinionsWithCoords.length > 0) {
          const lat = opinionsWithCoords.reduce((sum, op) => sum + (op.lat || 0), 0) / opinionsWithCoords.length;
          const lng = opinionsWithCoords.reduce((sum, op) => sum + (op.lng || 0), 0) / opinionsWithCoords.length;
          setCenter([lat, lng]);
          centerInitialized.current = true;
        }

        if (opinionsWithCoords.length === 0) {
          setError('No se encontraron opiniones para este casero.');
        }
      } catch (err) {
        console.error('Error searching opinions:', err);
        setError('Error al buscar opiniones. Por favor, inténtalo de nuevo.');
        setOpinions([]);
      } finally {
        // no-op
      }
    };

    fetchOpinions();
  }, [caseroId]);

  // Load public reviews (is_public = true) once
  useEffect(() => {
    (async () => {
      const rows = await getPublicReviews();
      setPublicReviews(rows);
      // Optionally center roughly on the average of public reviews if no center was initialized by geolocation/opinions
      if (!centerInitialized.current && rows.length > 0) {
        const valid = rows.filter((r): r is PublicReview & { lat: number; lng: number } =>
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

  // Try to center on user's current location on first mount
  useEffect(() => {
    if (centerInitialized.current) return; // avoid re-running
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter([latitude, longitude]);
          setZoom(16);
          centerInitialized.current = true;
        },
        () => {
          // keep Madrid fallback
          setCenter([40.416775, -3.70379]);
          setZoom(14);
          centerInitialized.current = true;
        }
      );
    } else {
      setCenter([40.416775, -3.70379]);
      setZoom(14);
      centerInitialized.current = true;
    }
  }, []);

  // AddressAutocomplete onSelect is handled inline in JSX below to keep local state updates together

  // Geolocate and map-click actions are disabled for public browse mode

  return (
    <div className="w-full px-6 md:px-8 pt-24 md:pt-28 pb-8">
      <div className="grid md:grid-cols-[360px_1fr] gap-4">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <ReviewsPanel
            reviews={visiblePublic.map((r) => ({
              id: r.id,
              lat: r.lat ?? undefined,
              lng: r.lng ?? undefined,
              texto: r.full_address ?? '—',
            }))}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            onSelect={(r) => {
              const lat = (r.lat as number) ?? undefined;
              const lng = (r.lng as number) ?? undefined;
              if (lat && lng) {
                // Animate to marker via RecenterOnSelect only (avoid center state to prevent shaking)
                setSelected({ lat, lng, address: r.texto || '' });
              }
              const match = publicReviews.find((x) => String(x.id) === String(r.id));
              if (match) setSelectedReview(match);
            }}
          />
        </aside>

        {/* Map container */}
        <div className="relative">
          {/* Floating centered Search Bar */}
          <div className="absolute left-1/2 top-6 md:top-8 z-[1000] w-[min(640px,92vw)] -translate-x-1/2">
            <SearchBar
              value={searchValue}
              onSelect={(result: AddressResult) => {
                setSearchValue(result.formatted || '');
                setSelected({
                  lat: result.geometry.lat,
                  lng: result.geometry.lng,
                  address: result.formatted || '',
                });
                setError(null);
              }}
              
            />
          </div>

          {/* Actions (placeholder for filters, etc.) */}
          <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
            {/* Future: MapActionButtons */}
          </div>

          {/* Map */}
          <div className="relative z-0 w-full h-[80vh] rounded-3xl border border-gray-200 overflow-hidden shadow-md bg-white/10">
            <MapContainer
              center={center}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              <RecenterOnSelect coords={selected ? { lat: selected.lat, lng: selected.lng } : null} />
              <OpinionsLayer opinions={opinions} />
              <PublicReviewsLayer
                reviews={publicReviews}
                selectedId={selectedReview?.id ?? null}
                onSelect={(rev: PublicReview) => {
                  // open right panel
                  setSelectedReview(rev);
                  // animate map to marker
                  if (typeof rev.lat === 'number' && typeof rev.lng === 'number') {
                    setSelected({ lat: rev.lat, lng: rev.lng, address: rev.full_address || '' });
                  }
                }}
              />
              <MapBoundsWatcher items={publicReviews} onChange={setVisiblePublic} />
            </MapContainer>
          </div>

          {/* Right-side details panel (absolute) */}
          {selectedReview && (
            <div className="hidden md:block fixed right-6 top-28 z-[1100] w-[360px]">
              <DetailsPanel review={selectedReview} onClose={() => setSelectedReview(null)} />
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
  );
};

export default MapView;
