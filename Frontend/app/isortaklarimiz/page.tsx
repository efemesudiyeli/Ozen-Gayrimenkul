
import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { Metadata } from 'next'
import Image from 'next/image'

interface TeamPageData {
  title: string;
  heroTitle: string;
  heroDescription: string;
  metaDescription: string;
}

const teamPageQuery = `*[_type == "teamPage" && _id == "teamPage"][0]{
  title,
  heroTitle,
  heroDescription,
  metaDescription
}`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const teamData = await client.fetch<TeamPageData>(teamPageQuery, {}, { next: { revalidate: 10 } });
    return {
      title: `${teamData.title || 'İş Ortaklarımız'} | Hatice Özen Gayrimenkul`,
      description: teamData.metaDescription || 'Alanında uzman, profesyonel gayrimenkul iş ortaklarımızla tanışın.',
    };
  } catch {
    return {
      title: 'İş Ortaklarımız | Hatice Özen Gayrimenkul',
      description: 'Alanında uzman, profesyonel gayrimenkul iş ortaklarımızla tanışın.',
    };
  }
}

const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

const query = `*[_type == "agent"]{
  _id,
  name,
  slug,
  image,
  position,
  phone,
  email
}`

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
  const agents: Agent[] = await client.fetch(query, {}, { next: { revalidate: 10 } });

  const defaultTeamData: TeamPageData = {
    title: 'İş Ortaklarımız',
    heroTitle: 'İş Ortaklarımız',
    heroDescription: 'Alanında uzman, güvenilir ve dinamik iş ortaklarımızla tanışın.',
    metaDescription: 'Alanında uzman, profesyonel gayrimenkul iş ortaklarımızla tanışın.'
  };

  let teamData = defaultTeamData;

  try {
    const fetchedTeamData = await client.fetch<TeamPageData>(teamPageQuery, {}, { next: { revalidate: 10 } });
    if (fetchedTeamData) {
      teamData = fetchedTeamData;
    }
  } catch (error) {
    console.error('Team page data fetch error:', error);
  }

  return (
    <main className="bg-white">

      {/* Hero Section */}
      <div className="bg-anthracite-900 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            {teamData.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-inter">
            {teamData.heroDescription}
          </p>
        </div>
      </div>

      <div className="my-12 flex flex-wrap justify-center gap-24 max-w-4xl mx-auto px-4">
        {agents.map((agent) => (
          <div key={agent._id} className="text-center w-72">
            <div className="mx-auto h-48 w-48 rounded-full overflow-hidden relative shadow-lg">
              <Image
                src={urlFor(agent.image).width(400).height(400).url()}
                alt={`${agent.name} portre fotoğrafı`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-atnhracite-400">{agent.position}</p>
              <div className="mt-4 text-gray-600 space-y-1">
                {agent.email && <a href={`mailto:${agent.email}`} className="hover:text-blue-700">{agent.email}</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>

  )
}

export default AgentsPage