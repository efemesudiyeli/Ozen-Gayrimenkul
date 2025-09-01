import { client } from '@/sanity/client'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Portfolyo | Özen Gayrimenkul',
  description: 'Başarıyla tamamladığımız satış ve kiralama işlemlerimizden bazıları.',
}

// Sanity resimleri için yardımcı fonksiyon
import imageUrlBuilder from '@sanity/image-url'
const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

const query = `*[_type == "property" && status != 'aktif'] | order(_updatedAt desc){
  _id,
  title,
  slug,
  mainImage,
  location,
  status
}`;

interface PortfolioProperty {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  location: string;
  status: 'satildi' | 'kiralandi';
}

const PortfolioPage = async () => {
  const properties: PortfolioProperty[] = await client.fetch(query);

  return (
    <main className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Başarılarımız
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Müşterilerimizin hayallerine kavuşmasına yardımcı olduğumuz, başarıyla tamamladığımız satış ve kiralama işlemlerimizden bazıları.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {properties.map((property) => (
          <Link
            key={property._id}
            href={`/ilan/${property.slug.current}`}
            className="group block"
          >
            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative h-56 w-full">
                <Image
                  src={urlFor(property.mainImage).width(600).height(400).url()}
                  alt={property.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Durum Etiketi */}
                <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold text-white rounded-md ${
                  property.status === 'satildi' ? 'bg-green-600' : 'bg-yellow-600'
                }`}>
                  {property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold truncate text-gray-900">
                  {property.title}
                </h2>
                <p className="text-gray-600 mt-1">{property.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default PortfolioPage;