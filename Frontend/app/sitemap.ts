import { MetadataRoute } from 'next'
import { client } from '../sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

  const staticPaths = ['', 'hakkimizda', 'portfoy', 'danismanlarimiz', 'iletisim']
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}/${path}`.replace(/\/$/, '/'),
    lastModified: new Date(),
  }))

  const properties: { slug?: string; _updatedAt?: string }[] = await client.fetch(
    `*[_type == "property" && coalesce(isActive, true) == true && defined(slug.current)]{ "slug": slug.current, _updatedAt }`
  )

  const dynamicEntries: MetadataRoute.Sitemap = properties
    .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
    .map((p) => ({
      url: `${baseUrl}/ilan/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
    }))

  return [...staticEntries, ...dynamicEntries]
}


