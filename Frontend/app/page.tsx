"use client";

import Link from 'next/link';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const query = `*[_type == "property" && status == 'aktif']{
_id,
title,
slug,
price,
mainImage,
location,
area,
propertyType
}`;

interface Property {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  mainImage: SanityImageSource;
  location: string;
  area: number;
  propertyType: 'daire' | 'villa' | 'mustakil' | 'isyeri';
}

export default function HomePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('tumu');

  useEffect(() => {
    const fetchProperties = async () => {
      const properties: Property[] = await client.fetch(
        query, 
        {},
        { next: { revalidate: 10 } }
      );
      setAllProperties(properties);
      setFilteredProperties(properties); 
    };
    fetchProperties();
  }, []);

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'tumu') {
      setFilteredProperties(allProperties);
    } else {
      const filtered = allProperties.filter(
        (property) => property.propertyType === filter
      );
      setFilteredProperties(filtered);
    }
  };

  const filterOptions = [
    { key: 'tumu', label: 'Tümü' },
    { key: 'daire', label: 'Daire' },
    { key: 'villa', label: 'Villa' },
    { key: 'mustakil', label: 'Müstakil' },
    { key: 'isyeri', label: 'İş Yeri' },
  ];

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-800">
        Özen Gayrimenkul | Güncel İlanlar
      </h1>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-8">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleFilter(option.key)}
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-200 ${
              activeFilter === option.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredProperties.map((property) => (
          <Link
            key={property._id}
            href={`/ilan/${property.slug.current}`}
            className="group block"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
            <div className="relative h-56 w-full">
        {property.mainImage ? (
          <Image
            src={urlFor(property.mainImage).width(600).height(400).url()}
            alt={property.title}
            fill 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center"><span className="text-gray-500">Fotoğraf Yok</span></div>
        )}
      </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold truncate text-gray-900">{property.title}</h2>
                <p className="text-gray-600 mt-1">{property.location}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-2xl font-bold text-blue-600">{property.price?.toLocaleString('tr-TR')} ₺</p>
                  <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{property.area} m²</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredProperties.length === 0 && allProperties.length > 0 && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700">Aradığınız Kriterlere Uygun İlan Bulunamadı.</h2>
          <p className="mt-2 text-gray-500">Lütfen farklı bir filtre seçeneği deneyin.</p>
        </div>
      )}
    </main>
  );
}
