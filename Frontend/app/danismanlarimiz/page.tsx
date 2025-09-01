import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ekibimiz | Özen Gayrimenkul',
  description: 'Alanında uzman, profesyonel gayrimenkul danışmanlarımızla tanışın.',
}

// Sanity resimleri için yardımcı fonksiyon
const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Sanity'den tüm danışmanları çekecek sorgu
const query = `*[_type == "agent"]{
  _id,
  name,
  slug,
  image,
  position,
  phone,
  email
}`

// Agent (Danışman) verisinin tip tanımı
interface Agent {
  _id: string
  name: string
  slug: { current: string }
  image: SanityImageSource
  position: string
  phone: string
  email: string
}

const AgentsPage = async () => {
  const agents: Agent[] = await client.fetch(query)

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Profesyonel Ekibimiz
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Sizlere en iyi hizmeti sunmak için buradayız. Alanında uzman, güvenilir ve dinamik danışmanlarımızla tanışın.
          </p>
        </div>

        <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent._id} className="text-center">
              <img
                className="mx-auto h-48 w-48 rounded-full object-cover shadow-lg"
                src={urlFor(agent.image).width(400).height(400).url()}
                alt={agent.name}
              />
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-blue-600">{agent.position}</p>
                <div className="mt-4 text-gray-600 space-y-1">
                  {agent.phone && <p>{agent.phone}</p>}
                  {agent.email && <a href={`mailto:${agent.email}`} className="hover:text-blue-700">{agent.email}</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AgentsPage