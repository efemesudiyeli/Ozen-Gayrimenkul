import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'Hakkımızda Sayfası',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sayfa Başlığı (SEO için)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Ana Başlık',
      type: 'string',
      description: 'Sayfanın en üstünde görünecek büyük başlık',
    }),
    defineField({
      name: 'content',
      title: 'Sayfa İçeriği',
      type: 'array', // Zengin metin içeriği için 'array' of 'block' kullanılır
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Başlık 2', value: 'h2'},
            {title: 'Başlık 3', value: 'h3'},
          ],
          lists: [
            {title: 'Madde İşareti', value: 'bullet'},
            {title: 'Numaralı Liste', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Kalın', value: 'strong'},
              {title: 'İtalik', value: 'em'},
            ],
          },
        },
      ],
    }),
  ],
})