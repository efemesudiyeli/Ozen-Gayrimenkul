import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Ana Sayfa Karşılama Alanı (Hero)',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Ana Başlık',
      type: 'string',
      description: 'Örn: Hayalinizdeki Evi Bulun',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Alt Başlık / Açıklama',
      type: 'text',
      description: 'Ana başlığın altında yer alacak açıklama metni.',
    }),
    defineField({
      name: 'buttonText',
      title: 'Buton Metni',
      type: 'string',
      description: 'Örn: Güncel İlanları Keşfedin',
      initialValue: 'Güncel İlanları Keşfedin',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Arka Plan Fotoğrafı',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
