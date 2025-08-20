import React from 'react';
import { useMapEvents } from 'react-leaflet';

interface ClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

export const ClickHandler: React.FC<ClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};
