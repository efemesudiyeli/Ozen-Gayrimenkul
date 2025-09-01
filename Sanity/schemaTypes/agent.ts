// emlak-projesi/schemaTypes/agent.ts

import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'agent',
  title: 'Emlak Danışmanı',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'İsim Soyisim',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Fotoğraf',
      type: 'image',
      options: {
        hotspot: true, // Fotoğrafta yüzü odaklamayı sağlar
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Unvan',
      type: 'string',
      description: 'Örn: Kurucu Ortak, Gayrimenkul Danışmanı',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon Numarası',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-posta Adresi',
      type: 'string',
      validation: (Rule) => Rule.email().warning('Geçerli bir e-posta adresi girin'),
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'text',
      description: 'Danışman hakkında kısa bir tanıtım yazısı.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      media: 'image',
    },
  },
})