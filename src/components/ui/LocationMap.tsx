import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import MapLibreLayer from '../map/MapLibreLayer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { svgToIcon } from '../map/svgIcon';
import { faceBubbleSVG } from '../map/heroPin';

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
  // Default to Madrid if no coordinates are provided
  const position: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [40.4168, -3.7038]; // Madrid coordinates

  // State for the marker position (can be different from coordinates prop if user clicks on map)
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);

  // Update marker position when coordinates prop changes
  useEffect(() => {
    if (coordinates) {
      setMarkerPosition([coordinates.lat, coordinates.lng]);
    }
  }, [coordinates]);

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
            // Build a face bubble icon similar to PublicReviewsLayer when wouldRecommend is provided
            if (!wouldRecommend) return defaultIcon;
            const wrNum = Number(wouldRecommend);
            const color = isNaN(wrNum)
              ? '#4B5563'
              : wrNum > 3
                ? '#22C55E'
                : wrNum < 3
                  ? '#EF4444'
                  : '#4B5563';
            const face = isNaN(wrNum) ? 'neutral' : wrNum <= 2 ? 'sad' : wrNum === 3 ? 'neutral' : 'happy';
            const size = 42;
            return svgToIcon(faceBubbleSVG({ fill: color, stroke: 'none', size, face }), [size, size], [size/2, size]);
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
