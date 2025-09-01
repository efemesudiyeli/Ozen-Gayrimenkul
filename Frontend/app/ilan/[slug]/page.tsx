import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

// Resim URL'lerini oluşturan yardımcı fonksiyonlarımızı tekrar tanımlıyoruz
const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Tek bir ilanı 'slug' değerine göre çekecek olan yeni sorgumuz
// slug.current alanı, URL'den gelen $slug parametresiyle eşleşen ilanı bulur
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
  description
}`

// Detay sayfasındaki ilanın daha zengin veri yapısını tanımlıyoruz
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
}

// Sayfa component'i URL'den gelen parametreleri 'params' objesiyle alır
export default async function PropertyPage({
  params,
}: {
  params: { slug: string }
}) {
  // Sorguyu çalıştırırken, URL'den gelen slug'ı parametre olarak gönderiyoruz
  const property: PropertyDetail = await client.fetch(query, {
    slug: params.slug,
  })

  // Eğer o slug'a sahip bir ilan bulunamazsa, 404 sayfasına yönlendir
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
        {/* Sol Sütun: Galeri ve Açıklama */}
        <div className="lg:col-span-2">
          {/* Ana Resim */}
          <div className="mb-4">
            <img
              src={urlFor(property.mainImage).width(1200).height(800).url()}
              alt={property.title}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Galeri */}
          {property.images && property.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {property.images.map((image, index) => (
                <img
                  key={index}
                  src={urlFor(image).width(400).height(300).url()}
                  alt={`${property.title} galeri fotoğrafı ${index + 1}`}
                  className="rounded-lg shadow-md"
                />
              ))}
            </div>
          )}

          {/* Açıklama */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">
            İlan Açıklaması
          </h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>

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

// Bu satır, verilerin taze kalmasını sağlar
export const revalidate = 10