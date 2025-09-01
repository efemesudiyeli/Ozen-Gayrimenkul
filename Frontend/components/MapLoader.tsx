"use client";

import dynamic from 'next/dynamic';

interface MapLoaderProps {
  coordinates: {
    lat: number;
    lng: number;
  };
  isApproximate: boolean;
}

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-200 flex items-center justify-center rounded-lg"><p>Harita Yükleniyor...</p></div>
});

const MapLoader = ({ coordinates, isApproximate }: MapLoaderProps) => {
  return <PropertyMap coordinates={coordinates} isApproximate={isApproximate} />;
};

export default MapLoader;