import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'property', // Veritabanındaki adı
  title: 'Emlak İlanı', // Admin panelindeki görünür adı
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'İlan Başlığı',
      type: 'string',
      validation: (Rule) => Rule.required().error('Bu alan zorunludur.'),
    }),
    defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      options: {
        source: 'title', // Otomatik olarak başlığı kullanır
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'number',
    }),
    defineField({
      name: 'location',
      title: 'Konum / Semt',
      type: 'string',
    }),
    defineField({
      name: 'propertyType',
      title: 'Emlak Tipi',
      type: 'string',
      options: {
        list: [
          {title: 'Daire', value: 'daire'},
          {title: 'Villa', value: 'villa'},
          {title: 'Müstakil Ev', value: 'mustakil'},
          {title: 'İş Yeri', value: 'isyeri'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Ana Fotoğraf',
      type: 'image',
      options: {
        hotspot: true, // Resmin önemli kısımlarını işaretlemeyi sağlar
      },
    }),
    defineField({
      name: 'images',
      title: 'Diğer Fotoğraflar (Galeri)',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'bedrooms',
      title: 'Oda Sayısı',
      type: 'number',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Banyo Sayısı',
      type: 'number',
    }),
    defineField({
      name: 'area',
      title: 'Metrekare (m²)',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    }),
  ],
})