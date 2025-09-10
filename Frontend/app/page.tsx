"use client";

import Link from 'next/link';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Hero, { HeroData } from '@/components/Hero';

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const query = `*[_type == "property" && (status == 'satilik' || status == 'kiralik')]{
  _id,
  _createdAt,
  title,
  slug,
  price,
  mainImage,
  province,
  district,
  neighborhood,
  area,
  grossArea,
  propertyType,
  status,
  bedrooms,
  bathrooms,
  buildingAge,
  floor,
  features,
  listingId,
  agent->{name, phone}
}`;

// Hero alanı için yeni Sanity sorgusu
const heroQuery = `*[_type == "hero"][0]`;

interface Property {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  price: number;
  mainImage: SanityImageSource;
  province: string;
  district: string;
  neighborhood: string;
  area: number;
  grossArea?: number;
  propertyType: 'daire' | 'villa' | 'mustakil' | 'isyeri' | 'arsa';
  status: 'satilik' | 'kiralik' | 'satildi' | 'kiralandi';
  bedrooms?: string;
  bathrooms?: number;
  buildingAge?: number;
  floor?: number;
  features?: string[];
  listingId: string;
  agent?: {
    name: string;
    phone: string;
  };
}

export default function HomePage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('tumu');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Advanced filters
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [roomCount, setRoomCount] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [provinceFilter, setProvinceFilter] = useState<string>('Antalya');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // Test için 3 ilan - normalde 12 olmalı


  const sortProperties = useCallback((properties: Property[], sortType: string): Property[] => {
    const sorted = [...properties];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'area-large':
        return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
      case 'area-small':
        return sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
      case 'province':
        return sorted.sort((a, b) => {
          const provinceA = a.province || '';
          const provinceB = b.province || '';
          return provinceA.localeCompare(provinceB, 'tr-TR', { 
            sensitivity: 'base',
            numeric: true,
            ignorePunctuation: true
          });
        });
      case 'district':
        return sorted.sort((a, b) => {
          const districtA = a.district || '';
          const districtB = b.district || '';
          return districtA.localeCompare(districtB, 'tr-TR', { 
            sensitivity: 'base',
            numeric: true,
            ignorePunctuation: true
          });
        });
      default:
        return sorted;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // İlan ve hero verilerini aynı anda çekerek performansı artırıyoruz
        const [properties, hero]: [Property[], HeroData] = await Promise.all([
          client.fetch(query, {}, { next: { revalidate: 10 } }),
          client.fetch(heroQuery, {}, { next: { revalidate: 10 } })
        ]);
        
        setAllProperties(properties);
        setHeroData(hero);
        // Apply current filters after data load - ensure initial display
        const sortedProperties = sortProperties(properties, sortBy);
        setFilteredProperties(sortedProperties);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sortBy, sortProperties]);

  const applyFilters = useCallback((filter: string = activeFilter, search: string = searchTerm) => {
    let filtered: Property[] = allProperties;
    
    // Property type filter
    if (filter !== 'tumu') {
      filtered = filtered.filter(
        (property) => property.propertyType === filter
      );
    }
    
    // Search filter
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter((property) => {
        const title = property.title?.toLowerCase() || '';
        const province = property.province?.toLowerCase() || '';
        const district = property.district?.toLowerCase() || '';
        const neighborhood = property.neighborhood?.toLowerCase() || '';
        const fullAddress = `${neighborhood} ${district} ${province}`.toLowerCase();
        
        return title.includes(searchLower) || fullAddress.includes(searchLower);
      });
    }
    
    // Price range filter
    if (minPrice) {
      const min = parseInt(minPrice.replace(/[^\d]/g, ''));
      filtered = filtered.filter((property) => property.price >= min);
    }
    if (maxPrice) {
      const max = parseInt(maxPrice.replace(/[^\d]/g, ''));
      filtered = filtered.filter((property) => property.price <= max);
    }
    
    // Room count filter
    if (roomCount) {
      filtered = filtered.filter((property) => property.bedrooms === roomCount);
    }
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((property) => property.status === statusFilter);
    }
    
    // Location filters
    if (provinceFilter) {
      filtered = filtered.filter((property) => property.province === provinceFilter);
    }
    if (districtFilter) {
      filtered = filtered.filter((property) => property.district === districtFilter);
    }
    if (neighborhoodFilter) {
      filtered = filtered.filter((property) => property.neighborhood === neighborhoodFilter);
    }
    
    const sortedFiltered = sortProperties(filtered, sortBy);
    setFilteredProperties(sortedFiltered);
  }, [allProperties, activeFilter, searchTerm, minPrice, maxPrice, roomCount, statusFilter, provinceFilter, districtFilter, neighborhoodFilter, sortBy, sortProperties]);

  // Apply filters when advanced filter values change
  useEffect(() => {
    if (allProperties.length > 0) {
      applyFilters(activeFilter, searchTerm);
    }
  }, [minPrice, maxPrice, roomCount, statusFilter, provinceFilter, districtFilter, neighborhoodFilter, activeFilter, allProperties.length, applyFilters, searchTerm]);

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    applyFilters(filter, searchTerm);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    applyFilters(activeFilter, search);
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    setCurrentPage(1);
    applyFilters(activeFilter, searchTerm);
  };

  // Helper functions to get unique values for dropdowns
  const getUniqueProvinces = () => {
    return [...new Set(allProperties.map(p => p.province).filter(Boolean))].sort();
  };

  const getUniqueDistricts = () => {
    const filtered = provinceFilter 
      ? allProperties.filter(p => p.province === provinceFilter)
      : allProperties;
    return [...new Set(filtered.map(p => p.district).filter(Boolean))].sort();
  };

  const getUniqueNeighborhoods = () => {
    const filtered = districtFilter 
      ? allProperties.filter(p => p.district === districtFilter)
      : allProperties;
    return [...new Set(filtered.map(p => p.neighborhood).filter(Boolean))].sort();
  };

  const getUniqueRoomCounts = () => {
    return [...new Set(allProperties.map(p => p.bedrooms).filter(Boolean))].sort();
  };

  // Advanced filter handlers
  const handleAdvancedFilter = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'minPrice':
        setMinPrice(value);
        break;
      case 'maxPrice':
        setMaxPrice(value);
        break;
      case 'roomCount':
        setRoomCount(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'province':
        setProvinceFilter(value);
        setDistrictFilter('');
        setNeighborhoodFilter('');
        break;
      case 'district':
        setDistrictFilter(value);
        setNeighborhoodFilter('');
        break;
      case 'neighborhood':
        setNeighborhoodFilter(value);
        break;
    }
  };

  const clearAllFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setRoomCount('');
    setStatusFilter('');
    setProvinceFilter('Antalya');
    setDistrictFilter('');
    setNeighborhoodFilter('');
    setSearchTerm('');
    setActiveFilter('tumu');
    setCurrentPage(1);
    applyFilters('tumu', '');
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  const filterOptions = [
    { key: 'tumu', label: 'Tümü' },
    { key: 'daire', label: 'Daire' },
    { key: 'villa', label: 'Villa' },
    { key: 'mustakil', label: 'Müstakil' },
    { key: 'isyeri', label: 'İş Yeri' },
    { key: 'arsa', label: 'Arsa' },
  ];

  const sortOptions = [
    { key: 'newest', label: 'En Yeni' },
    { key: 'oldest', label: 'En Eski' },
    { key: 'price-high', label: 'Fiyat (Yüksek → Düşük)' },
    { key: 'price-low', label: 'Fiyat (Düşük → Yüksek)' },
    { key: 'area-large', label: 'Alan (Büyük → Küçük)' },
    { key: 'area-small', label: 'Alan (Küçük → Büyük)' },
    { key: 'province', label: 'İl (A → Z)' },
    { key: 'district', label: 'İlçe (A → Z)' },
  ];

  return (
      <>
          {heroData && <Hero data={heroData} />}

      
      {/* İlanlar Bölümü - Modern Tasarım */}
      <main id="ilanlar" className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        {/* Header Section */}
        <div className="container mx-auto px-4 pt-12 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 text-gray-900 tracking-tight">
              Güncel İlanlar
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Size en uygun gayrimenkul seçeneklerini keşfedin
            </p>
            {searchTerm && (
              <p className="text-lg text-blue-600 mt-4 font-medium">
                &quot;{searchTerm}&quot; için {filteredProperties.length} sonuç bulundu
              </p>
            )}
          </div>

          {/* Search Box */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="İlan adı veya konumu ile arayın..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 pl-12 text-lg border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter ve Sıralama */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            {/* Modern Filter Buttons */}
            <div className="bg-white border border-gray-200 shadow-lg border border-gray-100">
              <div className="flex flex-wrap gap-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleFilter(option.key)}
                    className={`px-6 py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      activeFilter === option.key
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sıralama Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-white border border-gray-200 shadow-lg px-6 py-3 pr-10 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Custom Arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="bg-gray-600 text-white px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors duration-300 shadow-lg flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Gelişmiş Filtreler
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-8 bg-white p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Fiyat Aralığı</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Min TL"
                      value={minPrice}
                      onChange={(e) => handleAdvancedFilter('minPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Max TL"
                      value={maxPrice}
                      onChange={(e) => handleAdvancedFilter('maxPrice', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Room Count */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Oda Sayısı</label>
                  <select
                    value={roomCount}
                    onChange={(e) => handleAdvancedFilter('roomCount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tümü</option>
                    {getUniqueRoomCounts().map((rooms) => (
                      <option key={rooms} value={rooms}>
                        {rooms} Oda
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Durum</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleAdvancedFilter('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tümü</option>
                    <option value="satilik">Satılık</option>
                    <option value="kiralik">Kiralık</option>
                  </select>
                </div>

                {/* Province */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">İl</label>
                  <select
                    value={provinceFilter}
                    onChange={(e) => handleAdvancedFilter('province', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tümü</option>
                    {getUniqueProvinces().map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">İlçe</label>
                  <select
                    value={districtFilter}
                    onChange={(e) => handleAdvancedFilter('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tümü</option>
                    {getUniqueDistricts().map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Neighborhood */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mahalle</label>
                  <select
                    value={neighborhoodFilter}
                    onChange={(e) => handleAdvancedFilter('neighborhood', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tümü</option>
                    {getUniqueNeighborhoods().map((neighborhood) => (
                      <option key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="w-full bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors duration-300"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        <div className="container mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-lg border border-gray-200 animate-pulse h-full flex flex-col">
                  {/* Görsel Skeleton */}
                  <div className="relative h-64 bg-gray-200 flex-shrink-0">
                    {/* Badge Skeletons */}
                    <div className="absolute top-4 left-4 h-6 w-16 bg-gray-300"></div>
                    <div className="absolute top-4 right-4 h-6 w-12 bg-gray-300"></div>
                    <div className="absolute bottom-4 left-4 h-5 w-20 bg-gray-300"></div>
                  </div>
                  
                  {/* İçerik Skeleton */}
                  <div className="p-5 flex-grow flex flex-col">
                    {/* Başlık */}
                    <div className="h-6 bg-gray-200 mb-3 w-full"></div>
                    <div className="h-6 bg-gray-200 mb-3 w-3/4"></div>
                    
                    {/* Konum */}
                    <div className="h-4 bg-gray-200 mb-3 w-2/3"></div>
                    
                    {/* Özellikler Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="h-4 bg-gray-200 w-16"></div>
                      <div className="h-4 bg-gray-200 w-20"></div>
                      <div className="h-4 bg-gray-200 w-14"></div>
                      <div className="h-4 bg-gray-200 w-18"></div>
                    </div>
                    
                    {/* Alan Bilgisi */}
                    <div className="h-8 bg-gray-200 mb-4 w-full"></div>
                    
                    {/* Fiyat ve Detaylar */}
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <div className="h-8 bg-gray-200 w-32 mb-1"></div>
                        <div className="h-3 bg-gray-200 w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-200 w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentProperties.map((property) => (
              <Link
                key={property._id}
                href={`/ilan/${property.slug.current}`}
                className="group block"
              >
                <div className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 h-full flex flex-col">
                  {/* Görsel Alanı */}
                  <div className="relative h-64 overflow-hidden flex-shrink-0">
                    {property.mainImage ? (
                      <Image
                        src={urlFor(property.mainImage).width(600).height(400).url()}
                        alt={property.title}
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">Fotoğraf Yok</span>
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 text-xs font-bold text-white shadow-lg ${
                        property.status === 'satilik' ? 'bg-green-600' : 
                        property.status === 'kiralik' ? 'bg-blue-600' : 'bg-gray-600'
                      }`}>
                        {property.status === 'satilik' ? 'SATILIK' : 
                         property.status === 'kiralik' ? 'KİRALIK' : property.status?.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Property Type Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-semibold shadow-sm">
                        {property.propertyType === 'daire' ? 'DAİRE' :
                         property.propertyType === 'villa' ? 'VİLLA' :
                         property.propertyType === 'mustakil' ? 'MÜSTAKİL' :
                         property.propertyType === 'isyeri' ? 'İŞYERİ' : 'ARSA'}
                      </span>
                    </div>

                    {/* İlan No */}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-black/70 text-white px-2 py-1 text-xs font-medium">
                        #{property.listingId}
                      </span>
                    </div>
                  </div>

                  {/* İçerik Alanı */}
                  <div className="p-5 flex-grow flex flex-col">
                    {/* Başlık */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 min-h-[3rem]">
                      {property.title}
                    </h3>

                    {/* Konum */}
                    <div className="flex items-center text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">
                        {property.neighborhood}, {property.district} / {property.province}
                      </span>
                    </div>

                    {/* Özellikler Grid */}
                    {property.propertyType !== 'arsa' && (
                      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                        {property.bedrooms && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
                            </svg>
                            {property.bedrooms} Oda
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                            {property.bathrooms} Banyo
                          </div>
                        )}
                        {property.floor !== undefined && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {property.floor}. Kat
                          </div>
                        )}
                        {property.buildingAge !== undefined && (
                          <div className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {property.buildingAge} Yaş
                          </div>
                        )}
                      </div>
                    )}

                    {/* Alan Bilgisi */}
                    <div className="flex items-center justify-between mb-4 py-2 px-3 bg-gray-50">
                      <span className="text-sm text-gray-600">Net Alan:</span>
                      <span className="text-sm font-semibold text-gray-900">{property.area} m²</span>
                    </div>

                    {/* Fiyat ve Detaylar */}
                    <div className="flex justify-between items-end mt-auto">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {property.price?.toLocaleString('tr-TR')} ₺
                        </p>
                        {property.agent && (
                          <p className="text-xs text-gray-500 mt-1">
                            {property.agent.name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Detaylar
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 mb-8">
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Önceki
                </button>

                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!shouldShow) {
                      // Show ellipsis for gaps
                      if (page === 2 && currentPage > 4) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      if (page === totalPages - 1 && currentPage < totalPages - 3) {
                        return (
                          <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Empty State */}
        {filteredProperties.length === 0 && allProperties.length > 0 && (
          <div className="container mx-auto px-4 pb-20">
            <div className="text-center py-20">
              <div className="mb-8">
                <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {searchTerm ? 'Arama Sonucu Bulunamadı' : 'Aradığınız Kriterlere Uygun İlan Bulunamadı'}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `"${searchTerm}" araması için sonuç bulunamadı. Lütfen farklı bir arama terimi deneyin.`
                  : 'Lütfen farklı bir filtre seçeneği deneyin veya tüm ilanları görüntüleyin.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="bg-gray-600 text-white px-8 py-3 font-medium hover:bg-gray-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Aramayı Temizle
                  </button>
                )}
                <button
                  onClick={() => {
                    handleFilter('tumu');
                    handleSearch('');
                  }}
                  className="bg-blue-600 text-white px-8 py-3 font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Tüm İlanları Görüntüle
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
