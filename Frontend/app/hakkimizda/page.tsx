

import { client } from '@/sanity/client'
import { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import { PortableTextBlock } from 'sanity'
import Image from 'next/image'

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch<AboutPageData>(query)
  return {
    title: `${about.title} | Hatice Özen Gayrimenkul`,
  }
}

const query = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  title,
  heading,
  content
}`

interface AboutPageData {
  title: string
  heading: string
  content: PortableTextBlock[]
}

const HakkimizdaPage = async () => {
  const data: AboutPageData = await client.fetch(query)

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="bg-anthracite-900 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            {data.heading}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-inter">
            Hatice Özen Gayrimenkul olarak hikayemizi ve değerlerimizi keşfedin.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          <div className="text-gray-700 space-y-6 leading-relaxed prose prose-lg max-w-none">
            <Image src="/fullLogo.png" alt="Hatice Özen Gayrimenkul tam logo" width={300} height={300} className="mx-auto" />
            <PortableText value={data.content} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default HakkimizdaPage