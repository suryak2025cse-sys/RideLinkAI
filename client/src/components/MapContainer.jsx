import React from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Clock } from 'lucide-react';

const carIcon = L.divIcon({
  className: 'custom-car-icon',
  html: `<div style="background-color:#2563eb; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(37,99,235,0.4); border:3px solid #ffffff;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const pickupIcon = L.divIcon({
  className: 'custom-pickup-icon',
  html: `<div style="background-color:#10b981; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(16,185,129,0.3); border:3px solid #ffffff;">
          <div style="width:10px; height:10px; background:#ffffff; border-radius:50%;"></div>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const dropIcon = L.divIcon({
  className: 'custom-drop-icon',
  html: `<div style="background-color:#ef4444; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(239,68,68,0.3); border:3px solid #ffffff;">
          <div style="width:10px; height:10px; background:#ffffff; border-radius:50%;"></div>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export default function MapContainer({ 
  driverPos = { lat: 12.9730, lng: 77.5960 }, 
  pickupPos = { lat: 12.9716, lng: 77.5946 }, 
  dropPos = { lat: 12.9800, lng: 77.6000 },
  height = "420px" 
}) {
  const center = [driverPos.lat, driverPos.lng];
  const routePolyline = [
    [pickupPos.lat, pickupPos.lng],
    [driverPos.lat, driverPos.lng],
    [dropPos.lat, dropPos.lng]
  ];

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative group">
      <LeafletMap center={center} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline positions={routePolyline} color="#2563eb" weight={5} opacity={0.8} dashArray="8, 8" />

        <Marker position={[pickupPos.lat, pickupPos.lng]} icon={pickupIcon}>
          <Popup>
            <div className="font-bold text-sm text-emerald-700">Pickup Spot</div>
          </Popup>
        </Marker>

        <Marker position={[driverPos.lat, driverPos.lng]} icon={carIcon}>
          <Popup>
            <div className="font-bold text-sm text-blue-700">Driver Live Location</div>
          </Popup>
        </Marker>

        <Circle center={[pickupPos.lat, pickupPos.lng]} radius={300} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.12 }} />

        <Marker position={[dropPos.lat, dropPos.lng]} icon={dropIcon}>
          <Popup>
            <div className="font-bold text-sm text-rose-700">Destination Drop</div>
          </Popup>
        </Marker>
      </LeafletMap>

      {/* Floating ETA & GPS Info Card */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-md text-sm font-semibold text-slate-800 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="flex items-center gap-1.5 text-blue-600">
          <Navigation className="w-4 h-4" /> Live GPS Tracking Active
        </span>
      </div>
    </div>
  );
}
