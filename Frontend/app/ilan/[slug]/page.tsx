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
  province,
  district,
  neighborhood,
  propertyType,
  status,
  listingId,
  "mainImage": mainImage{
    ...,
    asset->{
      ...,
      metadata
    }
  },
  "images": images[]{
    ...,
    asset->{
      ...,
      metadata
    }
  },
  bedrooms,
  bathrooms,
  area,
  grossArea,
  buildingAge,
  floor,
  totalFloors,
  heatingType,
  features,
  description,
  locationMap,
  showApproximateLocation,
  polygon,
  agent->{
    name,
    phone,
    email,
    image
  }
}`

interface PropertyDetail {
  _id: string
  title: string
  price: number
  province: string
  district: string
  neighborhood: string
  propertyType: 'daire' | 'villa' | 'mustakil' | 'isyeri' | 'arsa'
  status: 'satilik' | 'kiralik' | 'satildi' | 'kiralandi'
  listingId: string
  mainImage: SanityImageSource
  images: SanityImageSource[]
  bedrooms?: string
  bathrooms?: number
  area: number
  grossArea?: number
  buildingAge?: number
  floor?: number
  totalFloors?: number
  heatingType?: string
  features?: string[]
  description: string
  locationMap?: { lat: number; lng: number }
  showApproximateLocation?: boolean
  polygon?: { lat: number; lng: number; _type: 'geopoint' }[]
  agent?: {
    name: string
    phone: string
    email: string
    image: SanityImageSource
  }
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
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tüm İlanlara Geri Dön
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Ana İçerik - Sol Taraf */}
          <div className="xl:col-span-3 space-y-8">
            {/* Galeri */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <PropertyGallery images={allImages} />
            </div>

            {/* İlan Bilgileri Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* İlan Açıklaması */}
              <div className="bg-white border border-gray-200 shadow-lg p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">İlan Açıklaması</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{displayDescription}</p>
              </div>

              {/* Özellikler */}
              <div className="bg-white border border-gray-200 shadow-lg p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Teknik Özellikler</h2>
                </div>
                <div className="space-y-3">
                  {property.propertyType !== 'arsa' && property.bedrooms && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Oda Sayısı
                      </span>
                      <span className="font-semibold text-gray-900">{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        Banyo Sayısı
                      </span>
                      <span className="font-semibold text-gray-900">{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4M4 8v8a2 2 0 002 2h8a2 2 0 002-2V8M4 8h16M20 8V4a1 1 0 00-1-1h-4" />
                      </svg>
                      Net Alan
                    </span>
                    <span className="font-semibold text-gray-900">{property.area} m²</span>
                  </div>
                  {property.grossArea && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Brüt Alan</span>
                      <span className="font-semibold text-gray-900">{property.grossArea} m²</span>
                    </div>
                  )}
                  {property.floor !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bulunduğu Kat</span>
                      <span className="font-semibold text-gray-900">{property.floor}. Kat</span>
                    </div>
                  )}
                  {property.totalFloors && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Toplam Kat</span>
                      <span className="font-semibold text-gray-900">{property.totalFloors} Kat</span>
                    </div>
                  )}
                  {property.buildingAge !== undefined && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Bina Yaşı</span>
                      <span className="font-semibold text-gray-900">{property.buildingAge} Yıl</span>
                    </div>
                  )}
                  {property.heatingType && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Isıtma Tipi</span>
                      <span className="font-semibold text-gray-900 capitalize">{property.heatingType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Özellikler Badges */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white border border-gray-200 shadow-lg p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Özellikler</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => {
                    const getFeatureInfo = (featureKey: string) => {
                      const featureMap = {
                        'furnished': { 
                          label: 'Eşyalı', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
                            </svg>
                          )
                        },
                        'balcony': { 
                          label: 'Balkon', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M12 3v18m0-18l4 4m-4-4L8 7" />
                            </svg>
                          )
                        },
                        'elevator': { 
                          label: 'Asansör', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </svg>
                          )
                        },
                        'parking': { 
                          label: 'Otopark', 
                          icon: (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                          )
                        },
                        'pool': { 
                          label: 'Yüzme Havuzu', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3-2 5-2 4 2 6 2 5-2 5-2M2 17s3-2 5-2 4 2 6 2 5-2 5-2M2 7s3-2 5-2 4 2 6 2 5-2 5-2" />
                            </svg>
                          )
                        },
                        'garden': { 
                          label: 'Bahçe', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21s.5-3.5 4-3.5 4 3.5 4 3.5" />
                            </svg>
                          )
                        },
                        'security': { 
                          label: 'Güvenlik', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          )
                        },
                        'inComplex': { 
                          label: 'Site İçerisinde', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                          )
                        }
                      };
                      return featureMap[featureKey as keyof typeof featureMap] || { label: featureKey, icon: null };
                    };

                    const featureInfo = getFeatureInfo(feature);
                    
                    return (
                      <div 
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-2 text-sm font-medium border border-blue-200 flex items-center gap-2"
                      >
                        {featureInfo.icon}
                        <span>{featureInfo.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Harita */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Konum</h2>
                </div>
              </div>
              <div className="h-96">
                {property.propertyType === 'arsa' && property.polygon && property.polygon.length > 0 ? (
                  <PropertyPolygonMapLoader coordinates={property.polygon} />
                ) : 
                property.locationMap ? (
                  <MapLoader 
                    coordinates={property.locationMap} 
                    isApproximate={property.showApproximateLocation || false} 
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Bu ilan için harita bilgisi mevcut değil.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sağ Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Fiyat ve Temel Bilgiler */}
              <div className="relative overflow-hidden bg-white border border-gray-200 shadow-lg">
                {/* Status Damgası */}
                {(property.status === 'satildi' || property.status === 'kiralandi') && (
                  <div className="absolute top-6 right-[-60px] rotate-[45deg] w-52 py-2 text-sm font-bold uppercase text-white shadow-lg bg-red-600 text-center z-10">
                    {property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
                  </div>
                )}

                <div className="p-6">
                  {/* İlan No ve Status */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold">
                      #{property.listingId}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold text-white ${
                      property.status === 'satilik' ? 'bg-green-600' : 
                      property.status === 'kiralik' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {property.status === 'satilik' ? 'SATILIK' : 
                       property.status === 'kiralik' ? 'KİRALIK' : 
                       property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {property.title}
                  </h1>

                  {/* Konum */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">
                      {property.neighborhood}, {property.district} / {property.province}
                    </span>
                  </div>

                  {/* Fiyat */}
                  {(property.status === 'satilik' || property.status === 'kiralik') && (
                    <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
                      <p className="text-3xl font-bold text-blue-600 text-center">
                        {property.price?.toLocaleString('tr-TR')} ₺
                      </p>
                      <p className="text-sm text-blue-600 text-center mt-1">
                        {property.status === 'satilik' ? 'Satış Fiyatı' : 'Aylık Kira'}
                      </p>
                    </div>
                  )}

                  {/* Emlak Tipi */}
                  <div className="text-center mb-6">
                    <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-semibold">
                      {property.propertyType === 'daire' ? 'DAİRE' :
                       property.propertyType === 'villa' ? 'VİLLA' :
                       property.propertyType === 'mustakil' ? 'MÜSTAKİL EV' :
                       property.propertyType === 'isyeri' ? 'İŞYERİ' : 'ARSA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danışman Bilgileri */}
              {property.agent && (
                <div className="bg-white border border-gray-200 shadow-lg p-6">
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">Danışmanınız</h3>
                  </div>
                  <div className="text-center">
                    {property.agent.image && (
                      <div className="w-20 h-20 mx-auto mb-4 overflow-hidden border-2 border-gray-200">
                        <Image
                          src={urlFor(property.agent.image).width(80).height(80).url()}
                          alt={property.agent.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 mb-2">{property.agent.name}</h4>
                    <div className="space-y-2">
                      <a 
                        href={`tel:${property.agent.phone}`}
                        className="block bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        📞 {property.agent.phone}
                      </a>
                      {property.agent.email && (
                        <a 
                          href={`mailto:${property.agent.email}`}
                          className="block bg-gray-600 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                          ✉️ E-posta Gönder
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const revalidate = 10

