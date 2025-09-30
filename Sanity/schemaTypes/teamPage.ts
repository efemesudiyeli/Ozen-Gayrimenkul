export default {
  name: 'teamPage',
  title: 'İş Ortaklarımız Sayfası',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'title',
      title: 'Sayfa Başlığı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroTitle',
      title: 'Hero Başlığı',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroDescription',
      title: 'Hero Açıklaması',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Açıklaması',
      type: 'text',
      description: 'SEO için sayfa açıklaması',
      validation: (Rule: any) => Rule.max(160),
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
