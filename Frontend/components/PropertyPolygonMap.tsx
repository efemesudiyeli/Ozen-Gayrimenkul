"use client";

import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Sanity'den gelen her bir noktanın tip tanımı
interface GeoPoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

// Bu component'in dışarıdan alacağı props'ların tanımı
interface PropertyPolygonMapProps {
  coordinates: GeoPoint[];
}

// Verilen köşe noktalarının tam ortasını bularak haritayı ortalayan yardımcı fonksiyon
const getCenter = (coords: GeoPoint[]): [number, number] => {
  if (!coords || coords.length === 0) return [36.8969, 30.7133]; // Varsayılan: Antalya
  const total = coords.reduce((acc, curr) => ({ lat: acc.lat + curr.lat, lng: acc.lng + curr.lng }), { lat: 0, lng: 0 });
  return [total.lat / coords.length, total.lng / coords.length];
};

const PropertyPolygonMap = ({ coordinates }: PropertyPolygonMapProps) => {
  // Gelen koordinatları Leaflet'in beklediği [lat, lng] formatına çeviriyoruz
  const polygonPositions = coordinates.map(p => [p.lat, p.lng] as [number, number]);
  const centerPosition = getCenter(coordinates);
  const [satellite, setSatellite] = useState(true);
  
  // Sınır çizgisinin rengini ve stilini belirliyoruz
  const polygonOptions = { color: 'yellow', fillColor: 'rgba(255, 255, 0, 0.2)' }

  return (
    <MapContainer center={centerPosition} zoom={17} style={{ height: '500px', width: '100%' }} className="rounded-lg z-0 relative">
      {satellite ? (
        <TileLayer
          attribution='Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      ) : (
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      )}

      <div className="absolute z-[1000] top-3 right-3">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-200 shadow bg-white/90 backdrop-blur">
          <button
            type="button"
            onClick={() => setSatellite(false)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${!satellite ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Harita
          </button>
          <button
            type="button"
            onClick={() => setSatellite(true)}
            className={`px-3 py-1.5 text-xs font-medium border-l border-gray-200 transition-colors ${satellite ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Uydu
          </button>
        </div>
      </div>
      
      {/* Gelen koordinatlara göre sınır çizgisini haritaya ekliyoruz */}
      <Polygon pathOptions={polygonOptions} positions={polygonPositions} />
    </MapContainer>
  );
};

export default PropertyPolygonMap;
