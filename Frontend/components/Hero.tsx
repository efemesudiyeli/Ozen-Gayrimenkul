// components/Hero.tsx
import Link from 'next/link';
import Image from 'next/image';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
type ImageWithAsset = SanityImageSource & { asset?: { _ref?: string; _id?: string; url?: string } }
function hasImageAsset(img?: unknown): img is ImageWithAsset {
  const asset = (img as ImageWithAsset | undefined)?.asset
  return Boolean(asset && (asset._ref || asset._id || asset.url))
}

// Hero bileşeninin alacağı verilerin tip tanımı
export interface HeroData {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundImage: SanityImageSource;
}

interface HeroProps {
  data: HeroData;
}

const Hero = ({ data }: HeroProps) => {
  // Veri gelmediyse veya eksikse, çökmemesi için bir yükleniyor durumu göster
  if (!data || !data.backgroundImage) {
    return (
      <div className="relative bg-gray-900 text-white h-screen flex items-center justify-center">
        <p className="text-gray-300">Karşılama alanı yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 text-white h-screen">
      <div className="absolute inset-0">
        <Image
          className="w-full h-full object-cover"
          src={hasImageAsset(data.backgroundImage) ? urlFor(data.backgroundImage).url() : '/vercel.svg'}
          alt="Modern bir evin dış cephesi"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center h-full flex flex-col justify-center items-center" role="region" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {data.heading} {/* Dinamik Başlık */}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
          {data.subheading} {/* Dinamik Alt Başlık */}
        </p>
        <div className="mt-8">
          <Link
            href="/#ilanlar"
            className="inline-block bg-anthracite-900 hover:bg-anthracite-700 text-white font-bold py-3 px-8  text-lg transition-transform transform hover:scale-105"
          >
            {data.buttonText} {/* Dinamik Buton Metni */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
