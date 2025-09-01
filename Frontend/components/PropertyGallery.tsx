// Frontend/components/PropertyGallery.tsx

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface PropertyGalleryProps {
  images: SanityImageSource[];
}

const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div>
      {/* Ana Fotoğraf Slider'ı */}
      <Swiper
        modules={[Navigation, Thumbs]}
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="rounded-lg shadow-lg"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-video">
              <Image
                src={urlFor(image).url()}
                alt={`İlan Fotoğrafı ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Slider'ı */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        spaceBetween={10}
        slidesPerView={4}
        watchSlidesProgress
        className="mt-4"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="cursor-pointer rounded-md overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
             <div className="relative w-full aspect-square">
                <Image
                    src={urlFor(image).url()}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                />
             </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PropertyGallery;