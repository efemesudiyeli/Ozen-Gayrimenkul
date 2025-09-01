

import { client } from '@/sanity/client'
import { Metadata } from 'next'
import { PortableText } from 'next-sanity' 
import { PortableTextBlock } from 'sanity'

export async function generateMetadata(): Promise<Metadata> {
  const about = await client.fetch<AboutPageData>(query)
  return {
    title: `${about.title} | Özen Gayrimenkul`,
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
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            {data.heading}
          </h1>
          
          <div className="mt-12 text-gray-700 space-y-6 leading-relaxed prose prose-lg max-w-none">
            <PortableText value={data.content} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HakkimizdaPage