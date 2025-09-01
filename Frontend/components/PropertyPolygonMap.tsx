"use client";

import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
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
  
  // Sınır çizgisinin rengini ve stilini belirliyoruz
  const polygonOptions = { color: 'yellow', fillColor: 'rgba(255, 255, 0, 0.2)' }

  return (
    <MapContainer center={centerPosition} zoom={17} style={{ height: '500px', width: '100%' }} className="rounded-lg z-0">
      {/* Müşterinin istediği Google Earth benzeri uydu görüntüsü için bu katmanı kullanıyoruz */}
      <TileLayer
        attribution='Google Maps Satellite'
        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        subdomains={['mt0','mt1','mt2','mt3']}
      />
      
      {/* Gelen koordinatlara göre sınır çizgisini haritaya ekliyoruz */}
      <Polygon pathOptions={polygonOptions} positions={polygonPositions} />
    </MapContainer>
  );
};

export default PropertyPolygonMap;
