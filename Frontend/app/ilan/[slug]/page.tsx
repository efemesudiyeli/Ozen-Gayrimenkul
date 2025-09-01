import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import MapLoader from '@/components/MapLoader';
import PropertyGallery from '@/components/PropertyGallery'
import PropertyPolygonMapLoader from '@/components/PropertyPolygonMapLoader';

// ... generateMetadata ve generateStaticParams fonksiyonları aynı kalıyor ...
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const query = `*[_type == "property" && slug.current == $slug][0]{
    title,
    description
  }`

  const property = await client.fetch<{ title: string; description: string }>(
    query,
    {
      slug: slug,
    }
  )

  if (!property) {
    return {
      title: 'İlan Bulunamadı',
    }
  }
  
  const description = property.description
  ? property.description.substring(0, 160)
  : 'Özen Gayrimenkul | Antalya bölgesindeki en güncel gayrimenkul ilanları.'; 


  return {
    title: `${property.title} | Özen Gayrimenkul`,
    description: description,
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

const propertyPageQuery = `*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  price,
  location,
  propertyType,
  status,
  mainImage,
  images,
  bedrooms,
  bathrooms,
  area,
  description,
  locationMap,
  showApproximateLocation,
  polygon
}`

interface PropertyDetail {
  _id: string
  title: string
  price: number
  location: string
  propertyType: string
  status: 'satilik' | 'kiralik' | 'satildi' | 'kiralandi';
  mainImage: SanityImageSource
  images: SanityImageSource[]
  bedrooms: number
  bathrooms: number
  area: number
  description: string
  locationMap?: { lat: number; lng: number };
  showApproximateLocation?: boolean;
  polygon?: { lat: number; lng: number; _type: 'geopoint' }[];
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property: PropertyDetail = await client.fetch(propertyPageQuery, {
    slug: slug,
  })

  if (!property) {
    notFound()
  }

  const allImages = [property.mainImage, ...(property.images || [])].filter(Boolean) as SanityImageSource[];
  const displayDescription = property.description || 'Bu ilan için henüz bir açıklama girilmemiştir.';

  return (
    <main className="container mx-auto p-4 md:p-8 bg-white">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
          &larr; Tüm İlanlara Geri Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyGallery images={allImages} />
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
              İlan Açıklaması
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">{displayDescription}</p>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
              Konum
            </h2>
            {property.propertyType === 'arsa' && property.polygon && property.polygon.length > 0 ? (
              <PropertyPolygonMapLoader coordinates={property.polygon} />
            ) : 
            property.locationMap ? (
              <MapLoader 
                coordinates={property.locationMap} 
                isApproximate={property.showApproximateLocation || false} 
              />
            ) : (
              <p className="text-gray-500">Bu ilan için harita bilgisi mevcut değil.</p>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* GÜNCELLEME: Sağdaki kutucuğa relative ve overflow-hidden eklendi */}
          <div className="relative overflow-hidden bg-gray-50 border p-6 rounded-lg shadow-md sticky top-8">
            
            {/* GÜNCELLEME: Vurucu Damga Efekti buraya da eklendi */}
            {(property.status === 'satildi' || property.status === 'kiralandi') && (
              <div className={`absolute top-10 right-[-70px] rotate-[45deg] w-64 py-1 text-xl font-bold uppercase text-white shadow-lg border-2 border-white text-center ${
               'bg-green-600/90'
              }`}>
                {property.status === 'satildi' ? 'Satıldı' : 'Kiralandı'}
              </div>
            )}
            
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight pt-4">
              {property.title}
            </h1>
            <p className="text-lg text-gray-600 mt-2">{property.location}</p>
            {/* Fiyat, sadece satılık veya kiralıksa gösterilir */}
            {(property.status === 'satilik' || property.status === 'kiralik') && (
              <p className="text-4xl font-bold text-blue-600 my-6">
                {property.price?.toLocaleString('tr-TR')} ₺
              </p>
            )}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-gray-700">İlan Tipi</span>
                <span className="text-gray-800 capitalize">{property.propertyType}</span>
              </div>
              {/* Oda sayısı gibi özellikler arsa değilse gösterilir */}
              {property.propertyType !== 'arsa' && (
                <>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-700">Oda Sayısı</span>
                    <span className="text-gray-800">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-700">Banyo Sayısı</span>
                    <span className="text-gray-800">{property.bathrooms}</span>
                  </div>
                </>
              )}
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

