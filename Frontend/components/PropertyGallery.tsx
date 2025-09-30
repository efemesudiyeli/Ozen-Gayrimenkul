"use client";

import { useState } from 'react';
import Image from 'next/image';
// YENİ EKLENEN IMPORT: TypeScript'e SanityImageSource'un ne olduğunu öğretiyoruz
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Swiper componentlerini ve stillerini import ediyoruz
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';


// Sanity resim URL'si için yardımcı fonksiyon
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Sanity'den gelen resim objesinin, boyut bilgilerini de içerecek şekilde tipini güncelliyoruz.
type SanityImageWithMeta = SanityImageSource & {
  asset?: {
    metadata?: {
      dimensions: {
        aspectRatio: number;
      };
    };
  };
}

// Component'in alacağı props'ların tip tanımı
type GalleryItem = SanityImageWithMeta | { _type: 'file'; alt?: string; asset?: { url?: string; mimeType?: string } };
interface PropertyGalleryProps {
  images: GalleryItem[];
}

const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div>
      {/* Ana Fotoğraf Slider'ı */}
      <Swiper
        modules={[Navigation, Thumbs, FreeMode]}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="shadow-lg rounded-lg bg-black aspect-video cursor-pointer"
      >
        {images.map((image, index) => {
          const isVideo = (image as any)?._type === 'file' && (image as any)?.asset?.mimeType?.startsWith('video/');
          if (isVideo) {
            const videoUrl = (image as any)?.asset?.url as string | undefined;
            return (
              <SwiperSlide key={index}>
                <div className="w-full h-full flex items-center justify-center bg-black">
                  {videoUrl ? (
                    <video controls preload="metadata" className="w-full h-full object-contain">
                      <source src={videoUrl} type={(image as any)?.asset?.mimeType || 'video/mp4'} />
                    </video>
                  ) : null}
                </div>
              </SwiperSlide>
            );
          }
          return (
            <SwiperSlide key={index}>
              <Image
                src={urlFor(image).url()}
                alt={`İlan görseli ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain" 
                priority={index === 0}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Thumbnail Slider'ı */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs, FreeMode]}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress
        className="mt-4"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="cursor-pointer rounded-md overflow-hidden opacity-60 hover:opacity-100 transition-opacity bg-black">
            <div className="relative w-full aspect-square">
              {((image as any)?._type === 'file' && (image as any)?.asset?.mimeType?.startsWith('video/')) ? (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : (
                <Image
                  src={urlFor(image).url()}
                  alt={`İlan küçük görseli ${index + 1}`}
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertyGallery;

