import { client } from '@/sanity/client'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Portföy | Özen Gayrimenkul',
  description: 'Başarıyla tamamladığımız satış ve kiralama işlemlerimizden bazıları.',
}

import imageUrlBuilder from '@sanity/image-url'
const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Sorgu, tüm property bilgilerini çekecek şekilde güncellendi
const query = `*[_type == "property" && (status == 'satildi' || status == 'kiralandi')] | order(_updatedAt desc){
  _id,
  title,
  slug,
  mainImage,
  location,
  status,
  propertyType,
  price,
  area,
  grossArea,
  bedrooms,
  bathrooms,
  floor,
  totalFloors,
  buildingAge,
  heatingType,
  features,
  listingId,
  province,
  district,
  neighborhood,
  agent->{
    name,
    phone,
    email,
    image
  }
}`;

interface PortfolioProperty {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  location: string;
  status: 'satildi' | 'kiralandi';
  propertyType: string;
  price: number;
  area: number;
  grossArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  buildingAge?: number;
  heatingType?: string;
  features?: string[];
  listingId: string;
  province: string;
  district: string;
  neighborhood: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
    image?: SanityImageSource;
  };
}

const PortfolioPage = async () => {
  const properties: PortfolioProperty[] = await client.fetch(query);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            Portföy
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-inter">
            Başarıyla tamamladığımız satış ve kiralama işlemlerimizden bazıları.
          </p>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link
              key={property._id}
              href={`/ilan/${property.slug.current}`}
              className="group block"
            >
              <div className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 h-full flex flex-col relative">
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

                  {/* Şovlu Satıldı/Kiralandı Damgası - Sol üstten sağa 45 derece */}
                  <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div className={`absolute top-40 -left-20 transform -rotate-45 origin-top-left ${
                      property.status === 'satildi' ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      <div className="px-32 py-4 text-white font-black text-xl uppercase tracking-wider shadow-2xl border-2 border-white/20">
                        {property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
                      </div>
                      {/* Damga gölgesi için ek katman */}
                      <div className="absolute inset-0 bg-black/20 transform translate-x-1 translate-y-1 -z-10"></div>
                    </div>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {property.buildingAge} Yaş
                        </div>
                      )}
                    </div>
                  )}

                  {/* Alan Bilgisi */}
                  <div className="bg-gray-50 p-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Net Alan:</span>
                      <span className="font-semibold text-gray-900">{property.area} m²</span>
                    </div>
                    {property.grossArea && (
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-gray-600">Brüt Alan:</span>
                        <span className="font-semibold text-gray-900">{property.grossArea} m²</span>
                      </div>
                    )}
                  </div>

                  {/* Fiyat ve Detaylar */}
                  <div className="flex justify-between items-end mt-auto">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ₺{property.price.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {property.status === 'satildi' ? 'Satış Fiyatı' : 'Kira Bedeli'}
                      </div>
                    </div>
                    {property.agent && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Danışman</div>
                        <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Henüz Tamamlanan İşlem Yok
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Başarıyla tamamladığımız satış ve kiralama işlemlerimiz burada görünecek.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Güncel İlanları Görüntüle
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default PortfolioPage;
