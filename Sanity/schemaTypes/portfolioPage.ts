export default {
  name: 'portfolioPage',
  title: 'Portföy Sayfası',
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
    {
      name: 'emptyStateMessage',
      title: 'Boş Durum Mesajları',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Başlık',
          type: 'string',
          initialValue: 'Henüz Tamamlanan İşlem Yok',
        },
        {
          name: 'description',
          title: 'Açıklama',
          type: 'text',
          initialValue: 'Başarıyla tamamladığımız satış ve kiralama işlemlerimiz burada görünecek.',
        },
        {
          name: 'buttonText',
          title: 'Buton Metni',
          type: 'string',
          initialValue: 'Güncel İlanları Görüntüle',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
