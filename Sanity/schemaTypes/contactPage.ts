export default {
  name: 'contactPage',
  title: 'İletişim Sayfası',
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
      name: 'contactInfo',
      title: 'İletişim Bilgileri',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Adres',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              initialValue: 'Adres',
            },
            {
              name: 'content',
              title: 'Adres Bilgisi',
              type: 'text',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'İkon',
              type: 'string',
              initialValue: '📍',
            },
          ],
        },
        {
          name: 'phone',
          title: 'Telefon',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              initialValue: 'Telefon',
            },
            {
              name: 'number',
              title: 'Telefon Numarası',
              type: 'string',
              description: 'Ülke kodu ve baştaki 0 olmadan, 10 hane (boşluk bırakabilirsiniz). Örn: 532 123 45 67',
              validation: (Rule: any) =>
                Rule.required().custom((val: string) => {
                  if (typeof val !== 'string') return 'Telefon numarası gerekli';
                  const digits = (val || '').replace(/[^0-9]/g, '');
                  if (!digits) return 'Telefon numarası gerekli';
                  if (digits.length !== 10) return '10 hane olmalı (ülke kodu ve baştaki 0 olmadan)';
                  if (digits[0] === '0') return 'Baştaki 0 olmamalı';
                  return true;
                }),
            },
            {
              name: 'displayNumber',
              title: 'Görüntülenecek Numara',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'İkon',
              type: 'string',
              initialValue: '📞',
            },
          ],
        },
        {
          name: 'email',
          title: 'E-posta',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              initialValue: 'E-posta',
            },
            {
              name: 'address',
              title: 'E-posta Adresi',
              type: 'string',
              validation: (Rule: any) => Rule.required().email(),
            },
            {
              name: 'icon',
              title: 'İkon',
              type: 'string',
              initialValue: '✉️',
            },
          ],
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
