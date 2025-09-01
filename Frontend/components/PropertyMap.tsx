"use client";

import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
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

  return (
    <MapContainer center={position} zoom={isApproximate ? 14 : 16} style={{ height: '400px', width: '100%' }} className="rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
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