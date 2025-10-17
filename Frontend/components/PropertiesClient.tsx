"use client";

import Link from "next/link";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
type ImageWithAsset = SanityImageSource & {
  asset?: { _ref?: string; _id?: string; url?: string };
};
function hasImageAsset(img?: unknown): img is ImageWithAsset {
  const asset = (img as ImageWithAsset | undefined)?.asset;
  return Boolean(asset && (asset._ref || asset._id || asset.url));
}

const query = `*[_type == "property" && coalesce(isActive, true) == true && (status == 'satilik' || status == 'kiralik')]{
  _id,
  _createdAt,
  title,
  slug,
  price,
  "mainImage": images[_type == 'image'][0],
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

interface Property {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  price: number | string;
  mainImage: SanityImageSource;
  province: string;
  district: string;
  neighborhood: string;
  area: number;
  grossArea?: number;
  propertyType: "daire" | "villa" | "mustakil" | "isyeri" | "arsa";
  status: "satilik" | "kiralik" | "satildi" | "kiralandi";
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

export default function PropertiesClient() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("tumu");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileView, setMobileView] = useState<"grid" | "list">("grid");

  // Advanced filters
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [roomCount, setRoomCount] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [provinceFilter, setProvinceFilter] = useState<string>("Antalya");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const parsePriceToNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const numeric = parseInt(value.replace(/[^\d]/g, ""));
      return isNaN(numeric) ? 0 : numeric;
    }
    return 0;
  };

  const sortProperties = useCallback(
    (properties: Property[], sortType: string): Property[] => {
      const sorted = [...properties];

      switch (sortType) {
        case "newest":
          return sorted.sort(
            (a, b) =>
              new Date(b._createdAt).getTime() -
              new Date(a._createdAt).getTime()
          );
        case "oldest":
          return sorted.sort(
            (a, b) =>
              new Date(a._createdAt).getTime() -
              new Date(b._createdAt).getTime()
          );
        case "price-high":
          return sorted.sort(
            (a, b) => parsePriceToNumber(b.price) - parsePriceToNumber(a.price)
          );
        case "price-low":
          return sorted.sort(
            (a, b) => parsePriceToNumber(a.price) - parsePriceToNumber(b.price)
          );
        case "area-large":
          return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
        case "area-small":
          return sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
        case "province":
          return sorted.sort((a, b) => {
            const provinceA = a.province || "";
            const provinceB = b.province || "";
            return provinceA.localeCompare(provinceB, "tr-TR", {
              sensitivity: "base",
              numeric: true,
              ignorePunctuation: true,
            });
          });
        case "district":
          return sorted.sort((a, b) => {
            const districtA = a.district || "";
            const districtB = b.district || "";
            return districtA.localeCompare(districtB, "tr-TR", {
              sensitivity: "base",
              numeric: true,
              ignorePunctuation: true,
            });
          });
        default:
          return sorted;
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const properties: Property[] = await client.fetch(query);
        setAllProperties(properties);
        const sortedProperties = sortProperties(properties, sortBy);
        setFilteredProperties(sortedProperties);
      } catch (error) {
        console.error("Veri yükleme hatası:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sortBy, sortProperties]);

  const applyFilters = useCallback(
    (filter: string = activeFilter, search: string = searchTerm) => {
      let filtered: Property[] = allProperties;

      if (filter !== "tumu") {
        filtered = filtered.filter(
          (property) => property.propertyType === filter
        );
      }

      if (search.trim() !== "") {
        const searchLower = search.toLowerCase().trim();
        filtered = filtered.filter((property) => {
          const title = property.title?.toLowerCase() || "";
          const province = property.province?.toLowerCase() || "";
          const district = property.district?.toLowerCase() || "";
          const neighborhood = property.neighborhood?.toLowerCase() || "";
          const fullAddress =
            `${neighborhood} ${district} ${province}`.toLowerCase();

          return (
            title.includes(searchLower) || fullAddress.includes(searchLower)
          );
        });
      }

      if (minPrice) {
        const min = parseInt(minPrice.replace(/[^\d]/g, ""));
        filtered = filtered.filter(
          (property) =>
            parsePriceToNumber(property.price) >= (isNaN(min) ? 0 : min)
        );
      }
      if (maxPrice) {
        const max = parseInt(maxPrice.replace(/[^\d]/g, ""));
        filtered = filtered.filter(
          (property) =>
            parsePriceToNumber(property.price) <=
            (isNaN(max) ? Number.MAX_SAFE_INTEGER : max)
        );
      }

      if (roomCount) {
        filtered = filtered.filter(
          (property) => property.bedrooms === roomCount
        );
      }

      if (statusFilter) {
        filtered = filtered.filter(
          (property) => property.status === statusFilter
        );
      }

      if (provinceFilter) {
        filtered = filtered.filter(
          (property) => property.province === provinceFilter
        );
      }
      if (districtFilter) {
        filtered = filtered.filter(
          (property) => property.district === districtFilter
        );
      }
      if (neighborhoodFilter) {
        filtered = filtered.filter(
          (property) => property.neighborhood === neighborhoodFilter
        );
      }

      const sortedFiltered = sortProperties(filtered, sortBy);
      setFilteredProperties(sortedFiltered);
    },
    [
      allProperties,
      activeFilter,
      searchTerm,
      minPrice,
      maxPrice,
      roomCount,
      statusFilter,
      provinceFilter,
      districtFilter,
      neighborhoodFilter,
      sortBy,
      sortProperties,
    ]
  );

  useEffect(() => {
    if (allProperties.length > 0) {
      applyFilters(activeFilter, searchTerm);
    }
  }, [
    minPrice,
    maxPrice,
    roomCount,
    statusFilter,
    provinceFilter,
    districtFilter,
    neighborhoodFilter,
    activeFilter,
    allProperties.length,
    applyFilters,
    searchTerm,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isLoading) return;
    if (window.location.hash === "#ilanlar") {
      const el = document.getElementById("ilanlar");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    }
  }, [isLoading]);

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

  const getUniqueProvinces = () => {
    return [
      ...new Set(allProperties.map((p) => p.province).filter(Boolean)),
    ].sort();
  };

  const getUniqueDistricts = () => {
    const filtered = provinceFilter
      ? allProperties.filter((p) => p.province === provinceFilter)
      : allProperties;
    return [...new Set(filtered.map((p) => p.district).filter(Boolean))].sort();
  };

  const getUniqueNeighborhoods = () => {
    const filtered = districtFilter
      ? allProperties.filter((p) => p.district === districtFilter)
      : allProperties;
    return [
      ...new Set(filtered.map((p) => p.neighborhood).filter(Boolean)),
    ].sort();
  };

  const getUniqueRoomCounts = () => {
    return [
      ...new Set(allProperties.map((p) => p.bedrooms).filter(Boolean)),
    ].sort();
  };

  const handleAdvancedFilter = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
      case "roomCount":
        setRoomCount(value);
        break;
      case "status":
        setStatusFilter(value);
        break;
      case "province":
        setProvinceFilter(value);
        setDistrictFilter("");
        setNeighborhoodFilter("");
        break;
      case "district":
        setDistrictFilter(value);
        setNeighborhoodFilter("");
        break;
      case "neighborhood":
        setNeighborhoodFilter(value);
        break;
    }
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setRoomCount("");
    setStatusFilter("");
    setProvinceFilter("Antalya");
    setDistrictFilter("");
    setNeighborhoodFilter("");
    setSearchTerm("");
    setActiveFilter("tumu");
    setCurrentPage(1);
    applyFilters("tumu", "");
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

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
    { key: "tumu", label: "Tümü" },
    { key: "daire", label: "Daire" },
    { key: "villa", label: "Villa" },
    { key: "mustakil", label: "Müstakil" },
    { key: "isyeri", label: "İş Yeri" },
    { key: "arsa", label: "Arsa" },
  ];

  const sortOptions = [
    { key: "newest", label: "En Yeni" },
    { key: "oldest", label: "En Eski" },
    { key: "price-high", label: "Fiyat (Yüksek → Düşük)" },
    { key: "price-low", label: "Fiyat (Düşük → Yüksek)" },
    { key: "area-large", label: "Alan (Büyük → Küçük)" },
    { key: "area-small", label: "Alan (Küçük → Büyük)" },
    { key: "province", label: "İl (A → Z)" },
    { key: "district", label: "İlçe (A → Z)" },
  ];

  return (
    <section
      id="ilanlar"
      aria-labelledby="ilanlar-heading"
      className="bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      {/* Filtering and properties display code continues - keeping only the essential structure for now */}
      <div className="container mx-auto px-4 pt-12 pb-12">
        <div className="text-center mb-8">
          <h2
            id="ilanlar-heading"
            className="text-4xl md:text-6xl font-bold mb-2 text-gray-900 tracking-tight"
          >
            Güncel İlanlar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Size en uygun gayrimenkul seçeneklerini keşfedin
          </p>
        </div>
        {/* Rest of the properties listing component goes here */}
        <p className="text-center text-gray-500">
          İlan listesi burada görünecek...
        </p>
      </div>
    </section>
  );
}
