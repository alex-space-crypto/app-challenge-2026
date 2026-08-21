import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Habit } from '../types';
import { verifiedLogCount } from '../habitUtils';

interface Props {
  habits: Habit[];
  focusLocation?: { lat: number; lng: number } | null;
}

const markerIcon = new L.DivIcon({
  className: 'custom-marker',
  html: '<div class="marker-pin">📍</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -28],
});

function MapFocuser({ focusLocation }: { focusLocation?: { lat: number; lng: number } | null }) {
  const map = useMap();
  React.useEffect(() => {
    if (focusLocation) {
      map.flyTo([focusLocation.lat, focusLocation.lng], 13, { duration: 1.5 });
    }
  }, [focusLocation, map]);
  return null;
}

export default function HabitMap({ habits, focusLocation }: Props) {
  const habitsWithLocations = habits.filter(h => h.location && !h.isPrivate);

  return (
    <MapContainer
      center={[35.7, -78.6]}
      zoom={9}
      scrollWheelZoom={true}
      className="habit-map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <MapFocuser focusLocation={focusLocation} />
      {habitsWithLocations.map(h => (
        <Marker
          key={h.id}
          position={[h.location!.lat, h.location!.lng]}
          icon={markerIcon}
        >
          <Popup>
            <div className="map-popup">
              <strong>{h.name}</strong>
              <p>{h.location!.address}</p>
              <p className="popup-progress">
                Progress: {verifiedLogCount(h)} / {h.goalCount}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
