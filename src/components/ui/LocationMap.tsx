import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import MapLibreLayer from '../map/MapLibreLayer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createRatingFaceIcon } from '../map/ratingFaceIcon';

// Fix for default marker icons in React-Leaflet
// This is needed because the default icons reference assets that might not be available
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to update map view when coordinates change
const ChangeView = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 16);
  }, [center, map]);

  return null;
};

// Component to handle map clicks
const MapClickHandler = ({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: e => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

interface LocationMapProps {
  coordinates?: {
    lat: number;
    lng: number;
  };
  className?: string;
  onLocationSelect?: (lat: number, lng: number) => void;
  wouldRecommend?: '1'|'2'|'3'|'4'|'5';
}

const LocationMap: React.FC<LocationMapProps> = ({
  coordinates,
  className = '',
  onLocationSelect,
  wouldRecommend,
}) => {
  // Default to London if no coordinates are provided
  const LONDON_COORDS: [number, number] = [51.5074, -0.1278];
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Try to get user's location on mount
  useEffect(() => {
    if (!coordinates && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log('Geolocation not available, using London as default');
        }
      );
    }
  }, [coordinates]);

  // Determine the center position: coordinates prop > user location > London
  const position: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : userLocation || LONDON_COORDS;

  // State for the marker position (can be different from coordinates prop if user clicks on map)
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);

  // Update marker position when coordinates prop or user location changes
  useEffect(() => {
    if (coordinates) {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    } else if (userLocation) {
      setMarkerPosition(userLocation);
    }
  }, [coordinates, userLocation]);

  // Handle map click to update marker position
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setMarkerPosition([lat, lng]);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  return (
    <div className={`h-64 w-full rounded-xl overflow-hidden border border-gray-300 shadow-md ${className}`}>
      <MapContainer
        center={position}
        zoom={coordinates ? 16 : 13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <MapLibreLayer />
        {/* Always show the marker, use markerPosition state */}
        <Marker
          position={markerPosition}
          icon={(function(){
            if (!wouldRecommend) return defaultIcon;
            const wrNum = Number(wouldRecommend);
            if (Number.isNaN(wrNum)) return defaultIcon;
            return createRatingFaceIcon({ rating: wrNum, size: 42 });
          })()}
          draggable={!!onLocationSelect}
          eventHandlers={{
            dragend: e => {
              const marker = e.target;
              const position = marker.getLatLng();
              if (onLocationSelect) {
                onLocationSelect(position.lat, position.lng);
              }
            },
          }}
        />
        <ChangeView center={markerPosition} />
        {/* Add map click handler if onLocationSelect is provided */}
        {onLocationSelect && <MapClickHandler onLocationSelect={handleLocationSelect} />}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
