import { client } from "@/sanity/client";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import { PortableTextBlock } from "sanity";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const aboutClient = client.withConfig({ useCdn: false });
  const about = await aboutClient.fetch<AboutPageData>(
    query,
    {},
    { next: { tags: ["aboutPage"] } }
  );
  return {
    title: `${about.title} | Hatice Özen Gayrimenkul`,
    description: about.metaDescription || undefined,
  };
}

const query = `*[_type == "aboutPage"] | order(_updatedAt desc)[0]{
  title,
  heading,
  heroDescription,
  metaDescription,
  content
}`;

interface AboutPageData {
  title: string;
  heading: string;
  content: PortableTextBlock[];
  heroDescription?: string;
  metaDescription?: string;
}

const HakkimizdaPage = async () => {
  const aboutClient = client.withConfig({ useCdn: false });
  const data: AboutPageData = await aboutClient.fetch(
    query,
    {},
    { next: { revalidate: 0, tags: ["aboutPage"] } }
  );

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="bg-anthracite-900 text-white py-20 mb-20 mt-14">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            {data.heading}
          </h1>
          {data.heroDescription ? (
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-inter">
              {data.heroDescription}
            </p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-gray-700 space-y-6 leading-relaxed prose prose-lg max-w-none">
            <Image
              src="/fullLogo.png"
              alt="Hatice Özen Gayrimenkul tam logo"
              width={300}
              height={300}
              className="mx-auto"
            />
            <PortableText value={data.content} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HakkimizdaPage;
