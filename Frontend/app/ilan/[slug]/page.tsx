// Frontend/app/ilan/[slug]/page.tsx - TASARIMI DÜZELTİLMİŞ

import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import MapLoader from '@/components/MapLoader';

// ... generateMetadata, generateStaticParams, urlFor, query ve interface kısımları aynı ...
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const query = `*[_type == "property" && slug.current == $slug][0]{
    title,
    description
  }`

  const property = await client.fetch<{ title: string; description: string }>(
    query,
    {
      slug: params.slug,
    }
  )

  if (!property) {
    return {
      title: 'İlan Bulunamadı',
    }
  }

  return {
    title: `${property.title} | Özen Gayrimenkul`,
    description: property.description.substring(0, 160),
  }
}

export async function generateStaticParams() {
  const query = `*[_type == "property"]{ "slug": slug.current }`;
  const properties = await client.fetch<{ slug: string }[]>(query);

  if (!properties) return []

  return properties.map((property) => ({
    slug: property.slug,
  }));
}

const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

const query = `*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  price,
  location,
  propertyType,
  mainImage,
  images,
  bedrooms,
  bathrooms,
  area,
  description,
  locationMap,
  showApproximateLocation
}`

interface PropertyDetail {
  _id: string
  title: string
  price: number
  location: string
  propertyType: string
  mainImage: SanityImageSource
  images: SanityImageSource[]
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  locationMap?: { lat: number; lng: number };
  showApproximateLocation?: boolean;
}

export default async function PropertyPage({
  params,
}: {
  params: { slug: string }
}) {
  const property: PropertyDetail = await client.fetch(query, {
    slug: params.slug,
  })

  if (!property) {
    notFound()
  }

  return (
    <main className="container mx-auto p-4 md:p-8 bg-white">
      {/* Başa Dön Linki */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Tüm İlanlara Geri Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Sütun: Galeri, Açıklama ve Harita */}
        <div className="lg:col-span-2">
          {/* Ana Resim */}
          <div className="relative mb-4 w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <Image
              src={urlFor(property.mainImage).url()}
              alt={property.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Galeri */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {property.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={urlFor(image).url()}
                    alt={`${property.title} galeri fotoğrafı ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Açıklama */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
            İlan Açıklaması
          </h2>
          <p className="text-gray-700 leading-relaxed mb-8">{property.description}</p>

          {/* --- DEĞİŞİKLİK BURADA: Harita bölümü, sol sütunun içine, açıklamanın altına taşındı --- */}
          {property.locationMap && (
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
                Konum
              </h2>
              <MapLoader 
                coordinates={property.locationMap} 
                isApproximate={property.showApproximateLocation || false} 
              />
            </div>
          )}
        </div>

        {/* HARİTA BURADAN TAŞINDI */}

        {/* Sağ Sütun: Fiyat ve Özellikler */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 border p-6 rounded-lg shadow-md sticky top-8">
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {property.title}
            </h1>
            <p className="text-lg text-gray-600 mt-2">{property.location}</p>
            <p className="text-4xl font-bold text-blue-600 my-6">
              {property.price?.toLocaleString('tr-TR')} ₺
            </p>
            <div className="space-y-4">
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-700">İlan Tipi</span>
                <span className="text-gray-800 capitalize">{property.propertyType}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-700">Oda Sayısı</span>
                <span className="text-gray-800">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-700">Banyo Sayısı</span>
                <span className="text-gray-800">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-700">Alan</span>
                <span className="text-gray-800">{property.area} m²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const revalidate = 10