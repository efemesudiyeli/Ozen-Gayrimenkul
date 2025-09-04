import {defineField, defineType} from 'sanity'
import LeafletMapInput from '../components/LeafletMapInput'
import LeafletPolygonInput from '../components/LeafletPolygonInput'

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
  // Alanlar, Studio arayüzünde bu sekmeler altında gruplanacak
  fieldsets: [
    { name: 'basicInfo', title: 'Temel İlan Bilgileri', options: { collapsible: true, collapsed: false } },
    { name: 'locationInfo', title: 'Adres ve Konum', options: { collapsible: true, collapsed: false } },
    { name: 'details', title: 'İlan Detayları', options: { collapsible: true, collapsed: false } },
    { name: 'features', title: 'İç ve Dış Özellikler', options: { collapsible: true, collapsed: false } },
    { name: 'media', title: 'Görseller', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    // --- TEMEL BİLGİLER ---
    defineField({
      name: 'title',
      title: 'İlan Başlığı',
      type: 'string',
      description: 'Örn: "Lara\'da Deniz Manzaralı Lüks 3+1 Daire"',
      fieldset: 'basicInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'listingId',
      title: 'İlan Numarası',
      type: 'string',
      fieldset: 'basicInfo',
      initialValue: () => `${Math.floor(100000 + Math.random() * 900000)}`, // Rastgele 6 haneli numara
      readOnly: true,
      description: 'Sistem tarafından otomatik olarak oluşturulur.',
    }),
     defineField({
      name: 'agent',
      title: 'İlandan Sorumlu Danışman',
      type: 'reference',
      to: [{type: 'agent'}],
      fieldset: 'basicInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'İlan Durumu',
      type: 'string',
      fieldset: 'basicInfo',
      options: {
        list: [
          {title: 'Satılık', value: 'satilik'},
          {title: 'Kiralık', value: 'kiralik'},
          {title: 'Satıldı', value: 'satildi'},
          {title: 'Kiralandı', value: 'kiralandi'},
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
      fieldset: 'basicInfo',
      options: {
        list: [
          {title: 'Daire', value: 'daire'},
          {title: 'Villa', value: 'villa'},
          {title: 'Müstakil Ev', value: 'mustakil'},
          {title: 'İş Yeri', value: 'isyeri'},
          {title: 'Arsa', value: 'arsa'},
        ],
        layout: 'radio',
      },
       validation: (Rule) => Rule.required(),
    }),
     defineField({
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'number',
      fieldset: 'basicInfo',
      validation: (Rule) => Rule.required(),
    }),
     defineField({
      name: 'slug',
      title: 'URL (Slug)',
      type: 'slug',
      fieldset: 'basicInfo',
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
      name: 'province',
      title: 'İl',
      type: 'string',
      fieldset: 'locationInfo',
      options: {
        list: [
            "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", 
            "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", 
            "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", 
            "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", 
            "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", 
            "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", 
            "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", 
            "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", 
            "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", 
            "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", 
            "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", 
            "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", 
            "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
        ].sort()
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'district',
      title: 'İlçe',
      type: 'string',
      fieldset: 'locationInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'neighborhood',
      title: 'Mahalle',
      type: 'string',
      fieldset: 'locationInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locationMap',
      title: 'Harita Konumu',
      type: 'geopoint',
      description: 'Haritadan konum seçin - tıklayarak işaretleyin. Arsa ilanları için zorunlu değildir.',
      fieldset: 'locationInfo',
      hidden: ({document}) => document?.propertyType === 'arsa',
      components: {
        input: LeafletMapInput as any
      }
    }),
    defineField({
      name: 'polygon',
      title: 'Arsa Sınırları (Köşeleri İşaretle)',
      type: 'array',
      of: [{ type: 'geopoint' }],
      description: 'Sadece arsa ilanları için. Arsanın köşelerini haritaya tıklayarak işaretleyin.',
      fieldset: 'locationInfo',
      hidden: ({document}) => document?.propertyType !== 'arsa',
      components: {
        input: LeafletPolygonInput as any
      }
    }),
    defineField({
      name: 'showApproximateLocation',
      title: 'Konumu Yaklaşık Göster',
      type: 'boolean',
      description: 'Aktif edilirse, haritada tam nokta yerine 500 metrelik bir daire gösterilir.',
      fieldset: 'locationInfo',
      initialValue: false,
      hidden: ({document}) => document?.propertyType === 'arsa',
    }),

    // --- İLAN DETAYLARI ---
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      fieldset: 'details',
      description: 'İlanla ilgili tüm detayları bu alana yazın.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Net Metrekare (m²)',
      type: 'number',
      fieldset: 'details',
      validation: (Rule) => Rule.required(),
    }),
     defineField({
      name: 'grossArea',
      title: 'Brüt Metrekare (m²)',
      type: 'number',
      fieldset: 'details',
    }),
    defineField({
      name: 'bedrooms',
      title: 'Oda Sayısı',
      description: 'Örn: 3+1 için 3 girin.',
      type: 'string',
      fieldset: 'details',
      hidden: ({document}) => document?.propertyType === 'arsa' || document?.propertyType === 'isyeri',
    }),
    defineField({
      name: 'bathrooms',
      title: 'Banyo Sayısı',
      type: 'number',
      fieldset: 'details',
      hidden: ({document}) => document?.propertyType === 'arsa',
    }),
     defineField({
      name: 'buildingAge',
      title: 'Bina Yaşı',
      type: 'number',
      fieldset: 'details',
      hidden: ({document}) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'floor',
      title: 'Bulunduğu Kat',
      type: 'number',
      fieldset: 'details',
      hidden: ({document}) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'totalFloors',
      title: 'Binanın Kat Sayısı',
      type: 'number',
      fieldset: 'details',
      hidden: ({document}) => document?.propertyType === 'arsa',
    }),
    defineField({
      name: 'heatingType',
      title: 'Isıtma Tipi',
      type: 'string',
      fieldset: 'details',
      options: {
        list: [
          {title: 'Kombi (Doğalgaz)', value: 'kombi'},
          {title: 'Merkezi Sistem', value: 'merkezi'},
          {title: 'Klima', value: 'klima'},
          {title: 'Soba', value: 'soba'},
          {title: 'Yerden Isıtma', value: 'yerden-isitma'},
          {title: 'Yok', value: 'yok'},
        ],
      },
       hidden: ({document}) => document?.propertyType === 'arsa',
    }),

    // --- ÖZELLİKLER ---
    defineField({
      name: 'features',
      title: 'Genel Özellikler',
      type: 'array',
      fieldset: 'features',
      description: 'İlanın öne çıkan özelliklerini seçin.',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Eşyalı', value: 'furnished'},
          {title: 'Balkon', value: 'balcony'},
          {title: 'Asansör', value: 'elevator'},
          {title: 'Otopark', value: 'parking'},
          {title: 'Yüzme Havuzu', value: 'pool'},
          {title: 'Bahçe', value: 'garden'},
          {title: 'Güvenlik', value: 'security'},
          {title: 'Site İçerisinde', value: 'inComplex'},
        ]
      },
    }),
    
    // --- GÖRSELLER ---
    defineField({
      name: 'mainImage',
      title: 'Ana Fotoğraf',
      type: 'image',
      fieldset: 'media',
      options: {
        hotspot: true, 
      },
       validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Diğer Fotoğraflar (Galeri)',
      type: 'array',
      fieldset: 'media',
      of: [{type: 'image', options: { hotspot: true }}],
    }),

  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'listingId',
      media: 'mainImage',
    },
     prepare(selection) {
        const { title, subtitle, media } = selection;
        return {
            title: title,
            subtitle: `İlan No: ${subtitle || '...'}`,
            media: media,
        };
    },
  },
})

