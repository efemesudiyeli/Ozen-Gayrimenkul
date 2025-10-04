"use client";

import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src
});
L.Marker.prototype.options.icon = DefaultIcon;


const markerIcon = new L.Icon({
  iconUrl: '/marker-icon.png', // public klasörüne kopyalayacağımız dosyanın yolu
  shadowUrl: '/marker-shadow.png', // public klasörüne kopyalayacağımız dosyanın yolu
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyMapProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  isApproximate: boolean;
}



const PropertyMap = ({ coordinates, isApproximate }: PropertyMapProps) => {
  const position: [number, number] = [coordinates.lat, coordinates.lng];
  const radius = 500;
  const [satellite, setSatellite] = useState(false);

  return (
    <MapContainer center={position} zoom={isApproximate ? 14 : 16} style={{ height: '400px', width: '100%' }} className="rounded-lg relative">
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

      <div className="absolute z-[1200] top-2 right-2 md:top-3 md:right-3">
        <div className="inline-flex rounded-md overflow-hidden border border-gray-200 shadow bg-white/90 backdrop-blur">
          <button
            type="button"
            onClick={() => setSatellite(false)}
            className={`px-2.5 md:px-3 py-1.5 text-xs font-medium transition-colors ${!satellite ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Harita
          </button>
          <button
            type="button"
            onClick={() => setSatellite(true)}
            className={`px-2.5 md:px-3 py-1.5 text-xs font-medium border-l border-gray-200 transition-colors ${satellite ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            Uydu
          </button>
        </div>
      </div>
      
      {isApproximate ? (
        <>
          <Circle center={position} radius={radius} pathOptions={{ color: 'blue', fillColor: 'blue' }} />
        </>
      ) : (
        <Marker position={position} icon={markerIcon} />

      )}
    </MapContainer>
  );
};

export default PropertyMap;