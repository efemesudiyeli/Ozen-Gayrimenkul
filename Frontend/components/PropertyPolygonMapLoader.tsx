"use client";

import dynamic from 'next/dynamic';

// PropertyPolygonMap component'inin beklediği props'ları burada da tanımlıyoruz
interface GeoPoint {
  _type: 'geopoint';
  lat: number;
  lng: number;
}

interface PolygonMapLoaderProps {
  coordinates: GeoPoint[];
}

// Dinamik import işlemini bu component'in içine taşıyoruz
const PropertyPolygonMap = dynamic(() => import('@/components/PropertyPolygonMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-200 flex items-center justify-center rounded-lg"><p>Harita Yükleniyor...</p></div>
});

const PropertyPolygonMapLoader = ({ coordinates }: PolygonMapLoaderProps) => {
  return <PropertyPolygonMap coordinates={coordinates} />;
};

export default PropertyPolygonMapLoader;
