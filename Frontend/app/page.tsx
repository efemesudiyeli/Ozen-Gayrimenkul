// ozengayrimenkulfrontend/app/page.tsx

import Link from 'next/link'
import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Sanity'den gelen resimleri URL'ye çevirmek için yardımcı fonksiyonlar
const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Sanity'den veri çekmek için kullanacağımız sorgu
const query = `*[_type == "property"]{
  _id,
  title,
  slug,
  price,
  mainImage,
  location,
  area
}`

// Gelen verinin yapısını TypeScript'e tanıtıyoruz
interface Property {
  _id: string
  title: string
  slug: { current: string }
  price: number
  mainImage: SanityImageSource
  location: string
  area: number
}

export default async function HomePage() {
  const properties: Property[] = await client.fetch(query)

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-800">
        Özen Gayrimenkul | Güncel İlanlar
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {properties.map((property) => (
          <Link
            key={property._id}
            href={`/ilan/${property.slug.current}`}
            className="group block"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative h-56 w-full">
                {property.mainImage ? (
                  <img
                    src={urlFor(property.mainImage).width(600).height(400).url()}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Fotoğraf Yok</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold truncate text-gray-900">
                  {property.title}
                </h2>
                <p className="text-gray-600 mt-1">{property.location}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {property.price?.toLocaleString('tr-TR')} ₺
                  </p>
                  <p className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {property.area} m²
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export const revalidate = 10