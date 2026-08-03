import React, { useEffect, useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Leaflet Icons for OpenStreetMap
const createCustomIcon = (color, emoji) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const driverIcon = createCustomIcon('#FACC15', '🚗');
const pickupIcon = createCustomIcon('#10B981', '🟢');
const dropIcon = createCustomIcon('#EF4444', '🏁');

// Helper to update map view when driver or route changes
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapContainer({ 
  driverPos = { lat: 12.9730, lng: 77.5960 }, 
  pickupPos = { lat: 12.9716, lng: 77.5946 }, 
  dropPos = { lat: 12.9800, lng: 77.6000 },
  height = "420px" 
}) {
  const [currentDriverPos, setCurrentDriverPos] = useState([driverPos.lat || 12.9730, driverPos.lng || 77.5960]);

  useEffect(() => {
    if (driverPos.lat && driverPos.lng) {
      setCurrentDriverPos([driverPos.lat, driverPos.lng]);
    }
  }, [driverPos.lat, driverPos.lng]);

  const pickupCoords = [pickupPos.lat || 12.9716, pickupPos.lng || 77.5946];
  const dropCoords = [dropPos.lat || 12.9800, dropPos.lng || 77.6000];
  const polylineCoords = [pickupCoords, currentDriverPos, dropCoords];

  return (
    <div style={{ height }} className="w-full rounded-3xl overflow-hidden shadow-md border border-slate-200 relative bg-slate-900 z-0">
      
      {/* Live OpenStreetMap Leaflet Container */}
      <LeafletMap 
        center={currentDriverPos} 
        zoom={14} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={currentDriverPos} />
        
        {/* OpenStreetMap Standard Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Live Route Polyline */}
        <Polyline 
          positions={polylineCoords} 
          color="#F59E0B" 
          weight={4} 
          dashArray="8, 8" 
          opacity={0.8}
        />

        {/* Pickup Marker */}
        <Marker position={pickupCoords} icon={pickupIcon}>
          <Popup>
            <div className="text-xs font-bold font-sans">
              <span className="text-emerald-600 font-extrabold block">🟢 PICKUP SPOT</span>
              <span>Coordinates: {pickupCoords[0].toFixed(4)}, {pickupCoords[1].toFixed(4)}</span>
            </div>
          </Popup>
        </Marker>

        {/* Driver Live Marker */}
        <Marker position={currentDriverPos} icon={driverIcon}>
          <Popup>
            <div className="text-xs font-bold font-sans">
              <span className="text-amber-600 font-extrabold block">🚗 LIVE DRIVER GPS</span>
              <span>Tata Nexon EV (KA-01-EQ-9021)</span>
            </div>
          </Popup>
        </Marker>

        {/* Destination Drop Marker */}
        <Marker position={dropCoords} icon={dropIcon}>
          <Popup>
            <div className="text-xs font-bold font-sans">
              <span className="text-rose-600 font-extrabold block">🏁 DESTINATION DROP</span>
              <span>Coordinates: {dropCoords[0].toFixed(4)}, {dropCoords[1].toFixed(4)}</span>
            </div>
          </Popup>
        </Marker>
      </LeafletMap>

      {/* Floating OpenStreetMap Telemetry Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-md text-xs font-extrabold text-slate-900 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span>OpenStreetMap + Leaflet Live Driver Radar</span>
      </div>

    </div>
  );
}
