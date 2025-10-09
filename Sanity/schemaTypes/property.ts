import { defineField, defineType } from 'sanity'
import { mediaAssetSource } from 'sanity-plugin-media'
import LeafletMapInput from '../components/LeafletMapInput'
import LeafletPolygonInput from '../components/LeafletPolygonInput'
import DistrictSelectInput from '../components/DistrictSelectInput'
import NeighborhoodSelectInput from '../components/NeighborhoodSelectInput'
import ProvinceSelectOrText from '../components/ProvinceSelectOrText'
import ManualAddressToggle from '../components/ManualAddressToggle'
import ColorSwatchInput from '../components/ColorSwatchInput'
import CurrencyInput from '../components/CurrencyInput'
 

// Türkçe karakterleri İngilizce karşılıklarına çeviren fonksiyon
const turkishToEnglish = (str: string): string => {
  const turkishChars: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'I': 'I',
    'İ': 'I', 'i': 'i',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }

  return str.replace(/[çÇğĞıIİiöÖşŞüÜ]/g, (match) => turkishChars[match] || match)
}

export default defineType({
  name: 'property',
  title: 'Emlak İlanı',
  type: 'document',
  groups: [
    { name: 'basicInfo', title: 'Temel Bilgiler' },
    { name: 'locationInfo', title: 'Adres ve Konum' },
    { name: 'details', title: 'İlan Detayları' },
    { name: 'amenities', title: 'Özellik Kategorileri' },
    { name: 'media', title: 'Görseller' },
  ],
  fieldsets: [
    {
      name: 'addressFields',
      title: 'Adres Girişi',
      options: { collapsible: false }
    },
    {
      name: 'publishFields',
      title: 'Yayın',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'identityFields',
      title: 'Kimlik',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'pricingFields',
      title: 'Fiyat',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'agentFields',
      title: 'Danışman',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'mapFields',
      title: 'Harita',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'sizeFields',
      title: 'Metrekare',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'roomFields',
      title: 'Oda/Banyo',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'buildingFields',
      title: 'Bina/Kat',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'heatingKitchenFields',
      title: 'Isıtma/Mutfak',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'comfortFields',
      title: 'Balkon/Asansör/Otopark',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'furnishingComplexFields',
      title: 'Eşya/Site',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'usageDeedFields',
      title: 'Kullanım/Tapu',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'financeFields',
      title: 'Finans',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'externalLinkFields',
      title: 'Harici Bağlantılar',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landZoningFields',
      title: 'Arsa İmar/Koşullar',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landPricingFields',
      title: 'Arsa Fiyat/M²',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landRegistryFields',
      title: 'Ada/Parsel/Pafta',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landLocationFields',
      title: 'Arsa Konum',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landInfrastructureFields',
      title: 'Arsa Altyapı',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landGeneralFields',
      title: 'Arsa Genel',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'landViewFields',
      title: 'Arsa Manzara',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'mediaFields',
      title: 'Medya',
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: [
    // --- YAYIN DURUMU (HER ZAMAN EN BAŞTA) ---
    defineField({
      name: 'isActive',
      title: 'Yayında mı?',
      type: 'boolean',
      group: 'basicInfo',
      fieldset: 'publishFields',
      description: 'İlanı pasife almak için kapatın. Kapalıyken sitede görünmez.',
      initialValue: true,
    }),

    // --- TEMEL BİLGİLER ---
    defineField({
      name: 'title',
      title: 'İlan Başlığı',
      type: 'string',
      description: 'Örn: "Lara\'da Deniz Manzaralı Lüks 3+1 Daire"',
      group: 'basicInfo',
      fieldset: 'identityFields',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'listingId',
      title: 'İlan Numarası',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'identityFields',
      initialValue: () => `${Math.floor(100000 + Math.random() * 900000)}`, // Rastgele 6 haneli numara
      readOnly: true,
      description: 'Sistem tarafından otomatik olarak oluşturulur.',
    }),
    defineField({
      name: 'listingDate',
      title: 'İlan Tarihi',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'identityFields',
      validation: (Rule) => Rule.required(),
      description: 'İlan tarihini girin (örn: 09/09/2025)',
      placeholder: 'GG/AA/YYYY',
      initialValue: () => {
        const today = new Date()
        const day = String(today.getDate()).padStart(2, '0')
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const year = today.getFullYear()
        return `${day}/${month}/${year}`
      },
    }),
    defineField({
      name: 'agent',
      title: 'İlandan Sorumlu Danışman',
      type: 'reference',
      to: [{ type: 'agent' }],
      group: 'basicInfo',
      fieldset: 'agentFields',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'İlan Durumu',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'publishFields',
      options: {
        list: [
          { title: 'Satılık', value: 'satilik' },
          { title: 'Kiralık', value: 'kiralik' },
          { title: 'Satıldı', value: 'satildi' },
          { title: 'Kiralandı', value: 'kiralandi' },
        ],
        layout: 'radio',
      },
      initialValue: 'satilik',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'propertyType',
      title: 'Emlak Tipi',
      type: 'string',
      group: 'basicInfo',
      options: {
        list: [
          { title: 'Daire', value: 'daire' },
          { title: 'Villa', value: 'villa' },
          { title: 'Müstakil Ev', value: 'mustakil' },
          { title: 'İş Yeri', value: 'isyeri' },
          { title: 'Arsa', value: 'arsa' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'pricingFields',
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value) return 'Fiyat gerekli'
        const numericValue = parseInt(value.replace(/\./g, ''))
        if (isNaN(numericValue) || numericValue < 0) {
          return 'Geçerli bir fiyat girin'
        }
        return true
      }),
      description: 'Fiyatı Türk Lirası olarak girin (örn: 1.000.000)',
      components: {
        input: CurrencyInput as any,
      },
    }),
    defineField({
      name: 'slug',
      description: 'Oluştur butonuna basmanız yeterlidir. İsteğe bağlı olarak bu alanı değiştirebilirsiniz.',
      title: 'URL (Slug)',
      type: 'slug',
      group: 'basicInfo',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) => {
          // Önce Türkçe karakterleri çevir
          const turkishConverted = turkishToEnglish(input)
          // Sonra standart slug formatına çevir
          return turkishConverted
            .toLowerCase()
            .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
            .replace(/[^\w\-]+/g, '') // Alfanumerik ve tire dışındaki karakterleri kaldır
            .replace(/\-\-+/g, '-') // Çoklu tireleri tek tire yap
            .replace(/^-+/, '') // Başındaki tireleri kaldır
            .replace(/-+$/, '') // Sonundaki tireleri kaldır
            .slice(0, 96) // Maksimum uzunluk
        }
      },
      validation: (Rule) => Rule.required(),
    }),

    // --- ADRES BİLGİLERİ ---
    defineField({
      name: 'manualAddress',
      title: 'Adres Giriş Modu',
      type: 'boolean',
      group: 'locationInfo',
      fieldset: 'addressFields',
      initialValue: false,
      components: { input: ManualAddressToggle as any },
    }),
    defineField({
      name: 'province',
      title: 'İl',
      type: 'string',
      group: 'locationInfo',
      fieldset: 'addressFields',
      components: { input: ProvinceSelectOrText as any },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'district',
      title: 'İlçe',
      type: 'string',
      group: 'locationInfo',
      fieldset: 'addressFields',
      components: {
        input: DistrictSelectInput as any,
      },
      validation: (Rule) => Rule.required(),
      hidden: ({ document }) => !document?.manualAddress && !document?.province,
    }),
    defineField({
      name: 'neighborhood',
      title: 'Mahalle',
      type: 'string',
      group: 'locationInfo',
      fieldset: 'addressFields',
      components: {
        input: NeighborhoodSelectInput as any,
      },
      validation: (Rule) => Rule.required(),
      hidden: ({ document }) => !document?.manualAddress && !document?.district,
    }),
    defineField({
      name: 'locationMap',
      title: 'Harita Konumu',
      type: 'geopoint',
      description: 'Haritadan konum seçin - tıklayarak işaretleyin.',
      group: 'locationInfo',
      fieldset: 'mapFields',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      components: {
        input: LeafletMapInput as any
      }
    }),
    defineField({
      name: 'polygon',
      title: 'Arsa Sınırları (Köşeleri İşaretle)',
      type: 'array',
      of: [{ type: 'geopoint' }],
      description: 'Arsanın köşelerini haritaya tıklayarak işaretleyin. En az 3 nokta, istediğiniz kadar nokta ekleyebilirsiniz.',
      group: 'locationInfo',
      fieldset: 'mapFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      validation: (Rule) => Rule.min(3).max(50).error('Arsa sınırları için en az 3, en fazla 50 nokta gerekli'),
      components: {
        input: LeafletPolygonInput as any
      }
    }),
    defineField({
      name: 'showApproximateLocation',
      title: 'Konumu Yaklaşık Göster',
      type: 'boolean',
      description: 'Aktif edilirse, haritada tam nokta yerine 500 metrelik bir daire gösterilir.',
      group: 'locationInfo',
      fieldset: 'mapFields',
      initialValue: false,
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),

    // --- İLAN DETAYLARI ---
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Başlık 1', value: 'h1' },
            { title: 'Başlık 2', value: 'h2' },
            { title: 'Başlık 3', value: 'h3' },
            { title: 'Alıntı', value: 'blockquote' },
          ],
          lists: [
            { title: 'Numaralı', value: 'number' },
            { title: 'Madde İşaretli', value: 'bullet' },
          ],
          marks: {
            decorators: [
              { title: 'Kalın', value: 'strong' },
              { title: 'İtalik', value: 'em' },
              { title: 'Altı Çizili', value: 'underline' },
              { title: 'Üstü Çizili', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'textColor',
                title: 'Yazı Rengi',
                type: 'object',
                icon: () => '🎨',
                components: {
                  input: ColorSwatchInput as any,
                },
                fields: [
                  {
                    name: 'color',
                    title: 'Renk',
                    type: 'object',
                    fields: [
                      {
                        name: 'hex',
                        type: 'string',
                        hidden: true,
                      },
                    ],
                  },
                ],
              },
              {
                name: 'fontSize',
                title: 'Yazı Boyutu',
                type: 'object',
                icon: () => '📝',
                fields: [
                  {
                    name: 'size',
                    title: 'Boyut',
                    type: 'string',
                    options: {
                      list: [
                        { title: 'Küçük', value: 'sm' },
                        { title: 'Normal', value: 'base' },
                        { title: 'Büyük', value: 'lg' },
                        { title: 'Çok Büyük', value: 'xl' },
                      ],
                      layout: 'radio',
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
      group: 'details',
      description: 'İlanla ilgili tüm detayları bu alana yazın.',
      validation: (Rule) => Rule.required(),
    }),

    // --- İŞYERİ ÖZEL ALANLARI ---
    defineField({
      name: 'businessCategories',
      title: 'İşyeri Türü',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Atölye',
          'Ayakkabıcı & Lostra',
          'Büfe',
          'Cafe & Bar',
          'Çay Ocağı',
          'Eczane & Medikal',
          'Hırdavatçı & Nalbur',
          'İmalathane',
          'Kuaför & Güzellik Merkezi',
          'Market & Bakkal',
          'Muayenehane',
          'Oto Kuaför & Yıkama',
          'Otomotiv',
          'Oyun Cafe',
          'Oyuncakçı',
          'Pastane & Fırın',
          'Prova & Kayıt Stüdyosu',
          'Restoran & Lokanta',
          'Su Bayi',
          'Tamirhane',
          'Tekel Bayi',
          'Züccaciyeci',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'businessGeneralFeatures',
      title: 'Genel Özellikler (İşyeri)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Güvenlik Kamerası',
          'Jeneratör',
          'Su Deposu',
          'Yangın Alarmı',
          'Hırsız Alarmı',
          'Hidrofor',
          'Mutfak',
          'WC',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'businessProximity',
      title: 'Yakınlık (İşyeri)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Sağlık Ocağı',
          'Hastane',
          'Veteriner',
          'Cami',
          'Kilise',
          'Restoran',
          'Market',
          'Havaalanı',
          'Toplu Taşıma',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'businessView',
      title: 'Manzara (İşyeri)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Deniz',
          'Doğa',
          'Şehir',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'businessOrientation',
      title: 'Cephe (İşyeri)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'Kuzey',
          'Güney',
          'Doğu',
          'Batı',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'businessInfrastructure',
      title: 'Alt Yapı (İşyeri)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          'ADSL',
          'Wi-Fi',
          'Kablo TV',
          'Uydu',
          'Intercom',
          'Telefon Hattı',
          'Faks - Telefon Hattı',
          'Sanayi Elektriği',
        ],
      },
      group: 'details',
      hidden: ({document}) => document?.propertyType !== 'isyeri',
    }),
    defineField({
      name: 'area',
      title: 'Net Metrekare (m²)',
      type: 'number',
      group: 'details',
      fieldset: 'sizeFields',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'grossArea',
      title: 'Brüt Metrekare (m²)',
      type: 'number',
      group: 'details',
      fieldset: 'sizeFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Oda Sayısı',
      description: 'Örn: 3+1, 4+1, Stüdyo',
      type: 'string',
      group: 'details',
      fieldset: 'roomFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Banyo Sayısı',
      type: 'number',
      group: 'details',
      fieldset: 'roomFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'buildingAge',
      title: 'Bina Yaşı',
      type: 'string',
      group: 'details',
      fieldset: 'buildingFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
      options: {
        list: [
          { title: '0 (Yeni)', value: '0' },
          { title: '1-5 arası', value: '1-5' },
          { title: '6-10 arası', value: '6-10' },
          { title: '11-15 arası', value: '11-15' },
          { title: '16-20 arası', value: '16-20' },
          { title: '21 ve üzeri', value: '21+' },
        ],
      },
    }),
    defineField({
      name: 'floor',
      title: 'Bulunduğu Kat',
      type: 'string',
      description: 'Örn: Bahçe Katı, Zemin Kat, 3. Kat',
      group: 'details',
      fieldset: 'buildingFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'totalFloors',
      title: 'Binanın Kat Sayısı',
      type: 'number',
      group: 'details',
      fieldset: 'buildingFields',
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'heatingType',
      title: 'Isıtma Tipi',
      type: 'string',
      group: 'details',
      fieldset: 'heatingKitchenFields',
      options: {
        list: [
          { title: 'Kombi (Doğalgaz)', value: 'kombi' },
          { title: 'Merkezi Sistem', value: 'merkezi' },
          { title: 'Klima', value: 'klima' },
          { title: 'Soba', value: 'soba' },
          { title: 'Yerden Isıtma', value: 'yerden-isitma' },
          { title: 'Yok', value: 'yok' },
        ],
      },
      hidden: ({ document }) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'kitchenType',
      title: 'Mutfak',
      type: 'string',
      group: 'details',
      fieldset: 'heatingKitchenFields',
      options: {
        list: [
          { title: 'Kapalı', value: 'kapali' },
          { title: 'Amerikan Mutfak', value: 'amerikan' },
          { title: 'Yok', value: 'yok' },
        ],
      },
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'hasBalcony',
      title: 'Balkon',
      type: 'string',
      group: 'details',
      fieldset: 'comfortFields',
      options: {
        list: [
          { title: 'Var', value: 'var' },
          { title: 'Yok', value: 'yok' },
        ],
        layout: 'radio',
      },
      initialValue: 'yok',
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'hasElevator',
      title: 'Asansör',
      type: 'string',
      group: 'details',
      fieldset: 'comfortFields',
      options: {
        list: [
          { title: 'Var', value: 'var' },
          { title: 'Yok', value: 'yok' },
        ],
        layout: 'radio',
      },
      initialValue: 'yok',
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'hasParking',
      title: 'Otopark',
      type: 'string',
      group: 'details',
      fieldset: 'comfortFields',
      options: {
        list: [
          { title: 'Açık Otopark', value: 'acik' },
          { title: 'Kapalı Otopark', value: 'kapali' },
          { title: 'Açık ve Kapalı Otopark', value: 'acik-kapali' },
          { title: 'Yok', value: 'yok' },
        ],
        layout: 'radio',
      },
      initialValue: 'yok',
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'isFurnished',
      title: 'Eşyalı',
      type: 'string',
      group: 'details',
      fieldset: 'furnishingComplexFields',
      options: {
        list: [
          { title: 'Evet', value: 'evet' },
          { title: 'Hayır', value: 'hayir' },
        ],
        layout: 'radio',
      },
      initialValue: 'hayir',
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'isInComplex',
      title: 'Site İçerisinde',
      type: 'string',
      group: 'details',
      fieldset: 'furnishingComplexFields',
      options: {
        list: [
          { title: 'Evet', value: 'evet' },
          { title: 'Hayır', value: 'hayir' },
        ],
        layout: 'radio',
      },
      initialValue: 'hayir',
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'complexName',
      title: 'Site Adı',
      type: 'string',
      group: 'details',
      fieldset: 'furnishingComplexFields',
      initialValue: 'Belirtilmemiş',
      hidden: ({ document }) => document?.isInComplex !== 'evet',
    }),
    defineField({
      name: 'dues',
      title: 'Aidat (₺)',
      type: 'string',
      group: 'details',
      fieldset: 'furnishingComplexFields',
      validation: (Rule) => Rule.custom((value) => {
        if (value === undefined || value === null || value === '') return true
        const numericValue = parseInt(String(value).replace(/\./g, ''))
        if (isNaN(numericValue) || numericValue < 0) {
          return 'Geçerli bir aidat girin'
        }
        return true
      }),
      description: 'Aidatı Türk Lirası olarak girin (örn: 1.500)',
      hidden: ({ document }) => document?.isInComplex !== 'evet',
      components: {
        input: CurrencyInput as any,
      },
    }),
    defineField({
      name: 'usageStatus',
      title: 'Kullanım Durumu',
      type: 'string',
      group: 'details',
      fieldset: 'usageDeedFields',
      options: {
        list: [
          { title: 'Boş', value: 'bos' },
          { title: 'Kiracılı', value: 'kiraci' },
          { title: 'Mülk Sahibi', value: 'mal-sahibi' },
        ],
      },
      hidden: ({ document }) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'deposit',
      title: 'Depozito (₺)',
      type: 'string',
      group: 'basicInfo',
      fieldset: 'pricingFields',
      validation: (Rule) => Rule.custom((value) => {
        if (value === undefined || value === null || value === '') return true
        const numericValue = parseInt(String(value).replace(/\./g, ''))
        if (isNaN(numericValue) || numericValue < 0) {
          return 'Geçerli bir depozito girin'
        }
        return true
      }),
      description: 'Depozitoyu Türk Lirası olarak girin (örn: 50.000)',
      hidden: ({ document }) => document?.status !== 'kiralik',
      components: {
        input: CurrencyInput as any,
      },
    }),
    defineField({
      name: 'titleDeedStatus',
      title: 'Tapu Durumu',
      type: 'string',
      group: 'details',
      fieldset: 'usageDeedFields',
      options: {
        list: [
          { title: 'Kat Mülkiyetli', value: 'kat-mulkiyetli' },
          { title: 'Kat İrtifaklı', value: 'kat-irtifakli' },
          { title: 'Hisseli', value: 'hisseli' },
          { title: 'Arsa Tapulu', value: 'arsa-tapulu' },
          { title: 'Müstakil Tapulu', value: 'mustakil-tapulu' },
          { title: 'Devre Mülk', value: 'devre-mulk' },
        ],
      },
    }),

    // --- ARSA ÖZEL ALANLARI ---
    defineField({
      name: 'imarDurumu',
      title: 'İmar Durumu',
      type: 'string',
      group: 'details',
      fieldset: 'landZoningFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          { title: 'Tarla', value: 'tarla' },
          { title: 'Arsa', value: 'arsa' },
          { title: 'İmar Durumu Yok', value: 'imar-yok' },
          { title: 'Belirtilmemiş', value: 'belirtilmemis' },
        ],
      },
    }),
    defineField({
      name: 'pricePerSquareMeter',
      title: 'm² Fiyatı (₺)',
      type: 'number',
      group: 'details',
      fieldset: 'landPricingFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
    }),
    defineField({
      name: 'adaNo',
      title: 'Ada No',
      type: 'string',
      group: 'details',
      fieldset: 'landRegistryFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      initialValue: 'Belirtilmemiş',
    }),
    defineField({
      name: 'parselNo',
      title: 'Parsel No',
      type: 'string',
      group: 'details',
      fieldset: 'landRegistryFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      initialValue: 'Belirtilmemiş',
    }),
    defineField({
      name: 'paftaNo',
      title: 'Pafta No',
      type: 'string',
      group: 'details',
      fieldset: 'landRegistryFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      initialValue: 'Belirtilmemiş',
    }),
    defineField({
      name: 'kaks',
      title: 'Kaks (Emsal)',
      type: 'string',
      group: 'details',
      fieldset: 'landZoningFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      initialValue: 'Belirtilmemiş',
    }),
    defineField({
      name: 'gabari',
      title: 'Gabari',
      type: 'string',
      group: 'details',
      fieldset: 'landZoningFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      initialValue: 'Belirtilmemiş',
    }),
    defineField({
      name: 'krediyeUygunluk',
      title: 'Krediye Uygunluk',
      type: 'string',
      group: 'details',
      fieldset: 'financeFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          { title: 'Uygun', value: 'uygun' },
          { title: 'Uygun Değil', value: 'uygun-degil' },
          { title: 'Bilinmiyor', value: 'bilinmiyor' },
        ],
      },
      initialValue: 'bilinmiyor',
    }),
    defineField({
      name: 'takas',
      title: 'Takas',
      type: 'string',
      group: 'details',
      fieldset: 'financeFields',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          { title: 'Evet', value: 'evet' },
          { title: 'Hayır', value: 'hayir' },
        ],
        layout: 'radio',
      },
      initialValue: 'hayir',
    }),
    defineField({
      name: 'sahibindenLink',
      title: 'Sahibindene Git Linki',
      type: 'url',
      group: 'details',
      fieldset: 'externalLinkFields',
      description: 'İlanın sahibinden.com\'daki linkini buraya yapıştırın.',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),

    // --- ÖZELLİK KATEGORİLERİ ---
    defineField({
      name: 'orientation',
      title: 'Cephe',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          { title: 'Batı', value: 'Batı' },
          { title: 'Doğu', value: 'Doğu' },
          { title: 'Güney', value: 'Güney' },
          { title: 'Kuzey', value: 'Kuzey' },
        ]
      },
    }),
    defineField({
      name: 'indoorFeatures',
      title: 'İç Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'ADSL', 'Ahşap Doğrama', 'Akıllı Ev', 'Alarm (Hırsız)', 'Alarm (Yangın)', 'Alaturka Tuvalet', 'Alüminyum Doğrama', 'Amerikan Kapı', 'Ankastre Fırın', 'Barbekü', 'Beyaz Eşya', 'Boyalı', 'Bulaşık Makinesi', 'Buzdolabı', 'Çamaşır Kurutma Makinesi', 'Çamaşır Makinesi', 'Çamaşır Odası', 'Çelik Kapı', 'Duşakabin', 'Duvar Kağıdı', 'Ebeveyn Banyosu', 'Fırın', 'Fiber İnternet', 'Giyinme Odası', 'Gömme Dolap', 'Görüntülü Diyafon', 'Hilton Banyo', 'Intercom Sistemi', 'Isıcam', 'Jakuzi', 'Kartonpiyer', 'Kiler', 'Klima', 'Küvet', 'Laminat Zemin', 'Marley', 'Mobilya', 'Mutfak (Ankastre)', 'Mutfak (Laminat)', 'Mutfak Doğalgazı', 'Panjur/Jaluzi', 'Parke Zemin', 'PVC Doğrama', 'Seramik Zemin', 'Set Üstü Ocak', 'Spot Aydınlatma', 'Şofben', 'Şömine', 'Teras', 'Termosifon', 'Vestiyer', 'Wi-Fi', 'Yüz Tanıma & Parmak İzi'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'outdoorFeatures',
      title: 'Dış Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Araç Şarj İstasyonu', '24 Saat Güvenlik', 'Apartman Görevlisi', 'Buhar Odası', 'Çocuk Oyun Parkı', 'Hamam', 'Hidrofor', 'Isı Yalıtımı', 'Jeneratör', 'Kablo TV', 'Kamera Sistemi', 'Kreş', 'Müstakil Havuzlu', 'Sauna', 'Ses Yalıtımı', 'Siding', 'Spor Alanı', 'Su Deposu', 'Tenis Kortu', 'Uydu', 'Yangın Merdiveni', 'Yüzme Havuzu (Açık)', 'Yüzme Havuzu (Kapalı)'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'surroundings',
      title: 'Muhit',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Alışveriş Merkezi', 'Belediye', 'Cami', 'Cemevi', 'Denize Sıfır', 'Eczane', 'Eğlence Merkezi', 'Fuar', 'Göle Sıfır', 'Hastane', 'Havra', 'İlkokul-Ortaokul', 'İtfaiye', 'Kilise', 'Lise', 'Market', 'Park', 'Plaj', 'Polis Merkezi', 'Sağlık Ocağı', 'Semt Pazarı', 'Spor Salonu', 'Şehir Merkezi', 'Üniversite'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'transportation',
      title: 'Ulaşım',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Anayol', 'Avrasya Tüneli', 'Boğaz Köprüleri', 'Cadde', 'Deniz Otobüsü', 'Dolmuş', 'E-5', 'Havaalanı', 'İskele', 'Marmaray', 'Metro', 'Metrobüs', 'Minibüs', 'Otobüs Durağı', 'Sahil', 'Teleferik', 'TEM', 'Tramvay', 'Tren İstasyonu', 'Troleybüs'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'view',
      title: 'Manzara',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Boğaz', 'Deniz', 'Doğa', 'Göl', 'Havuz', 'Park & Yeşil Alan', 'Şehir'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'residenceType',
      title: 'Konut Tipi',
      type: 'string',
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Dubleks', 'En Üst Kat', 'Ara Kat', 'Ara Kat Dubleks', 'Bahçe Dubleksi', 'Çatı Dubleksi', 'Forleks', 'Ters Dubleks', 'Tripleks'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'accessibility',
      title: 'Engelliye ve Yaşlıya Uygun',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType === 'arsa',
      options: {
        list: [
          'Araç Park Yeri', 'Engelliye Uygun Asansör', 'Engelliye Uygun Banyo', 'Engelliye Uygun Mutfak', 'Engelliye Uygun Park', 'Geniş Koridor', 'Giriş / Rampa', 'Merdiven', 'Oda Kapısı', 'Priz / Elektrik Anahtarı', 'Tutamak / Korkuluk', 'Tuvalet', 'Yüzme Havuzu'
        ].map((t) => ({ title: t, value: t }))
      }
    }),

    // --- ARSA ÖZEL ÖZELLİKLER ---
    defineField({
      name: 'altyapi',
      title: 'Altyapı',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          'Elektrik', 'Sanayi Elektriği', 'Su', 'Telefon', 'Doğalgaz', 'Kanalizasyon', 'Arıtma', 'Sondaj & Kuyu', 'Zemin Etüdü', 'Yolu Açılmış', 'Yolu Açılmamış', 'Yolu Yok'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'konum',
      title: 'Konum',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          'Ana Yola Yakın', 'Denize Sıfır', 'Denize Yakın', 'Havaalanına Yakın', 'Toplu Ulaşıma Yakın'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'genelOzellikler',
      title: 'Genel Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          'İfrazlı', 'Parselli', 'Projeli', 'Köşe Parsel'
        ].map((t) => ({ title: t, value: t }))
      }
    }),
    defineField({
      name: 'manzaraArsa',
      title: 'Manzara',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'amenities',
      hidden: ({ document }) => document?.propertyType !== 'arsa',
      options: {
        list: [
          'Şehir', 'Deniz', 'Doğa', 'Boğaz', 'Göl'
        ].map((t) => ({ title: t, value: t }))
      }
    }),

    // --- GÖRSELLER ---
    defineField({
      name: 'images',
      title: 'Galeri (Fotoğraf/Video)',
      description: 'Galerinin ilk sırasındaki fotoğraf ilanın ana görseli olarak kullanılacaktır. Sürükle bırak işlemiyle birden fazla fotoğraf veya video ekleyebilirsiniz.',
      type: 'array',
      group: 'media',
      fieldset: 'mediaFields',
      of: [
        { type: 'image', options: { hotspot: true, sources: [mediaAssetSource] } },
        {
          type: 'file',
          title: 'Video',
          options: { sources: [mediaAssetSource], accept: 'video/mp4' },
          validation: (Rule) => Rule.required().warning('Lütfen yalnızca MP4 video yükleyin.'),
        },
      ],
      validation: (Rule) => Rule.min(0),
    }),

  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'listingId',
      images: 'images',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, images, isActive } = selection as {
        title?: string
        subtitle?: string
        images?: any[]
        isActive?: boolean
      }
      const media = Array.isArray(images) ? images.find((it) => it?._type === 'image') : undefined
      const inactiveSuffix = isActive === false ? ' • Pasif' : ''
      return {
        title: title,
        subtitle: `İlan No: ${subtitle || '...'}${inactiveSuffix}`,
        media: media,
      };
    },
  },
})

