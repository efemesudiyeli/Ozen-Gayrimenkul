import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import MapLoader from '@/components/MapLoader';
import PropertyGallery from '@/components/PropertyGallery'
import PropertyPolygonMapLoader from '@/components/PropertyPolygonMapLoader';

// ... generateMetadata ve generateStaticParams fonksiyonları aynı kalıyor ...
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const query = `*[_type == "property" && slug.current == $slug][0]{
    title,
    description
  }`

  const property = await client.fetch<{ title: string; description: string }>(
    query,
    {
      slug: slug,
    }
  )

  if (!property) {
    return {
      title: 'İlan Bulunamadı',
    }
  }
  
  const description = property.description
  ? property.description.substring(0, 160)
  : 'Hatice Özen Gayrimenkul | Antalya bölgesindeki en güncel gayrimenkul ilanları.'; 


  return {
    title: `${property.title} | Hatice Özen Gayrimenkul`,
    description: description,
  }
}
export async function generateStaticParams() {
  const query = `*[_type == "property"]{ "slug": slug.current }`;
  const properties = await client.fetch<{ slug: string }[]>(query);

  if (!properties) return []

  return properties.map((property) => ({
    slug: property.slug,
  }));
}


const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

const propertyPageQuery = `*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  price,
  province,
  district,
  neighborhood,
  propertyType,
  status,
  listingId,
  listingDate,
  "mainImage": mainImage{
    ...,
    asset->{
      ...,
      metadata
    }
  },
  "images": images[]{
    ...,
    asset->{
      ...,
      metadata
    }
  },
  bedrooms,
  bathrooms,
  area,
  grossArea,
  buildingAge,
  floor,
  totalFloors,
  heatingType,
  kitchenType,
  hasBalcony,
  hasElevator,
  hasParking,
  isFurnished,
  isInComplex,
  complexName,
  dues,
  usageStatus,
  deposit,
  titleDeedStatus,
  imarDurumu,
  pricePerSquareMeter,
  adaNo,
  parselNo,
  paftaNo,
  kaks,
  gabari,
  krediyeUygunluk,
  takas,
  orientation,
  indoorFeatures,
  outdoorFeatures,
  surroundings,
  transportation,
  view,
  residenceType,
  accessibility,
  altyapi,
  konum,
  genelOzellikler,
  manzaraArsa,
  description,
  sahibindenLink,
  locationMap,
  showApproximateLocation,
  polygon,
  agent->{
    name,
    phone,
    email,
    image
  }
}`

interface PropertyDetail {
  _id: string
  title: string
  price: number
  province: string
  district: string
  neighborhood: string
  propertyType: 'daire' | 'villa' | 'mustakil' | 'isyeri' | 'arsa'
  status: 'satilik' | 'kiralik' | 'satildi' | 'kiralandi'
  listingId: string
  listingDate?: string
  mainImage: SanityImageSource
  images: SanityImageSource[]
  bedrooms?: string
  bathrooms?: number
  area: number
  grossArea?: number
  buildingAge?: string
  floor?: string
  totalFloors?: number
  heatingType?: 'kombi' | 'merkezi' | 'klima' | 'soba' | 'yerden-isitma' | 'yok'
  kitchenType?: 'kapali' | 'amerikan' | 'yok'
  hasBalcony?: 'var' | 'yok'
  hasElevator?: 'var' | 'yok'
  hasParking?: 'acik' | 'kapali' | 'acik-kapali' | 'yok'
  isFurnished?: 'evet' | 'hayir'
  isInComplex?: 'evet' | 'hayir'
  complexName?: string
  dues?: number
  usageStatus?: 'bos' | 'kiraci' | 'mal-sahibi'
  deposit?: number
  titleDeedStatus?: 'kat-mulkiyetli' | 'kat-irtifakli' | 'hisseli' | 'arsa-tapulu' | 'mustakil-tapulu' | 'devre-mulk'
  imarDurumu?: 'tarla' | 'arsa' | 'imar-yok' | 'belirtilmemis'
  pricePerSquareMeter?: number
  adaNo?: string
  parselNo?: string
  paftaNo?: string
  kaks?: string
  gabari?: string
  krediyeUygunluk?: 'uygun' | 'uygun-degil' | 'bilinmiyor'
  takas?: 'evet' | 'hayir'
  orientation?: string[]
  indoorFeatures?: string[]
  outdoorFeatures?: string[]
  surroundings?: string[]
  transportation?: string[]
  view?: string[]
  residenceType?: string
  accessibility?: string[]
  altyapi?: string[]
  konum?: string[]
  genelOzellikler?: string[]
  manzaraArsa?: string[]
  description: string
  sahibindenLink?: string
  locationMap?: { lat: number; lng: number }
  showApproximateLocation?: boolean
  polygon?: { lat: number; lng: number; _type: 'geopoint' }[]
  agent?: {
    name: string
    phone: string
    email: string
    image: SanityImageSource
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const property: PropertyDetail = await client.fetch(propertyPageQuery, {
    slug: slug,
  })

  if (!property) {
    notFound()
  }

  const formatDateTR = (dateString?: string) => {
    if (!dateString) return null
    
    // GÜN/AY/YIL formatını kontrol et (örn: 09/09/2025)
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/')
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      if (isNaN(d.getTime())) return null
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
    }
    
    // ISO formatını kontrol et (örn: 2025-09-09)
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return null
    return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
  }

  const heatingLabel = (key?: PropertyDetail['heatingType']) => {
    switch (key) {
      case 'kombi': return 'Kombi (Doğalgaz)'
      case 'merkezi': return 'Merkezi Sistem'
      case 'klima': return 'Klima'
      case 'soba': return 'Soba'
      case 'yerden-isitma': return 'Yerden Isıtma'
      case 'yok': return 'Yok'
      default: return undefined
    }
  }

  const kitchenLabel = (key?: PropertyDetail['kitchenType']) => {
    switch (key) {
      case 'kapali': return 'Kapalı'
      case 'amerikan': return 'Amerikan Mutfak'
      case 'yok': return 'Yok'
      default: return undefined
    }
  }

  const yesNoLabel = (key?: 'evet' | 'hayir') => (key === 'evet' ? 'Evet' : key === 'hayir' ? 'Hayır' : undefined)
  const hasLabel = (key?: 'var' | 'yok') => (key === 'var' ? 'Var' : key === 'yok' ? 'Yok' : undefined)
  
  const parkingLabel = (key?: 'acik' | 'kapali' | 'acik-kapali' | 'yok') => {
    switch (key) {
      case 'acik': return 'Açık Otopark'
      case 'kapali': return 'Kapalı Otopark'
      case 'acik-kapali': return 'Açık ve Kapalı Otopark'
      case 'yok': return 'Yok'
      default: return undefined
    }
  }

  const usageStatusLabel = (key?: PropertyDetail['usageStatus']) => {
    switch (key) {
      case 'bos': return 'Boş'
      case 'kiraci': return 'Kiracı Oturuyor'
      case 'mal-sahibi': return 'Mal Sahibi Oturuyor'
      default: return undefined
    }
  }

  const titleDeedLabel = (key?: PropertyDetail['titleDeedStatus']) => {
    switch (key) {
      case 'kat-mulkiyetli': return 'Kat Mülkiyetli'
      case 'kat-irtifakli': return 'Kat İrtifaklı'
      case 'hisseli': return 'Hisseli'
      case 'arsa-tapulu': return 'Arsa Tapulu'
      case 'mustakil-tapulu': return 'Müstakil Tapulu'
      case 'devre-mulk': return 'Devre Mülk'
      default: return undefined
    }
  }

  const imarDurumuLabel = (key?: PropertyDetail['imarDurumu']) => {
    switch (key) {
      case 'tarla': return 'Tarla'
      case 'arsa': return 'Arsa'
      case 'imar-yok': return 'İmar Durumu Yok'
      case 'belirtilmemis': return 'Belirtilmemiş'
      default: return undefined
    }
  }

  const krediyeUygunlukLabel = (key?: PropertyDetail['krediyeUygunluk']) => {
    switch (key) {
      case 'uygun': return 'Uygun'
      case 'uygun-degil': return 'Uygun Değil'
      case 'bilinmiyor': return 'Bilinmiyor'
      default: return undefined
    }
  }

  const ORIENTATION_OPTIONS = ['Batı','Doğu','Güney','Kuzey']
  const INDOOR_FEATURES_OPTIONS = ['ADSL','Ahşap Doğrama','Akıllı Ev','Alarm (Hırsız)','Alarm (Yangın)','Alaturka Tuvalet','Alüminyum Doğrama','Amerikan Kapı','Ankastre Fırın','Barbekü','Beyaz Eşya','Boyalı','Bulaşık Makinesi','Buzdolabı','Çamaşır Kurutma Makinesi','Çamaşır Makinesi','Çamaşır Odası','Çelik Kapı','Duşakabin','Duvar Kağıdı','Ebeveyn Banyosu','Fırın','Fiber İnternet','Giyinme Odası','Gömme Dolap','Görüntülü Diyafon','Hilton Banyo','Intercom Sistemi','Isıcam','Jakuzi','Kartonpiyer','Kiler','Klima','Küvet','Laminat Zemin','Marley','Mobilya','Mutfak (Ankastre)','Mutfak (Laminat)','Mutfak Doğalgazı','Panjur/Jaluzi','Parke Zemin','PVC Doğrama','Seramik Zemin','Set Üstü Ocak','Spot Aydınlatma','Şofben','Şömine','Teras','Termosifon','Vestiyer','Wi-Fi','Yüz Tanıma & Parmak İzi']
  const OUTDOOR_FEATURES_OPTIONS = ['Araç Şarj İstasyonu','24 Saat Güvenlik','Apartman Görevlisi','Buhar Odası','Çocuk Oyun Parkı','Hamam','Hidrofor','Isı Yalıtımı','Jeneratör','Kablo TV','Kamera Sistemi','Kreş','Müstakil Havuzlu','Sauna','Ses Yalıtımı','Siding','Spor Alanı','Su Deposu','Tenis Kortu','Uydu','Yangın Merdiveni','Yüzme Havuzu (Açık)','Yüzme Havuzu (Kapalı)']
  const SURROUNDINGS_OPTIONS = ['Alışveriş Merkezi','Belediye','Cami','Cemevi','Denize Sıfır','Eczane','Eğlence Merkezi','Fuar','Göle Sıfır','Hastane','Havra','İlkokul-Ortaokul','İtfaiye','Kilise','Lise','Market','Park','Plaj','Polis Merkezi','Sağlık Ocağı','Semt Pazarı','Spor Salonu','Şehir Merkezi','Üniversite']
  const TRANSPORTATION_OPTIONS = ['Anayol','Avrasya Tüneli','Boğaz Köprüleri','Cadde','Deniz Otobüsü','Dolmuş','E-5','Havaalanı','İskele','Marmaray','Metro','Metrobüs','Minibüs','Otobüs Durağı','Sahil','Teleferik','TEM','Tramvay','Tren İstasyonu','Troleybüs']
  const VIEW_OPTIONS = ['Boğaz','Deniz','Doğa','Göl','Havuz','Park & Yeşil Alan','Şehir']
  const RESIDENCE_TYPE_OPTIONS = ['Dubleks','En Üst Kat','Ara Kat','Ara Kat Dubleks','Bahçe Dubleksi','Çatı Dubleksi','Forleks','Ters Dubleks','Tripleks']
  const ACCESSIBILITY_OPTIONS = ['Araç Park Yeri','Engelliye Uygun Asansör','Engelliye Uygun Banyo','Engelliye Uygun Mutfak','Engelliye Uygun Park','Geniş Koridor','Giriş / Rampa','Merdiven','Oda Kapısı','Priz / Elektrik Anahtarı','Tutamak / Korkuluk','Tuvalet','Yüzme Havuzu']
  
  // Land-specific amenity options
  const ALTYAPI_OPTIONS = ['Elektrik','Sanayi Elektriği','Su','Telefon','Doğalgaz','Kanalizasyon','Arıtma','Sondaj & Kuyu','Zemin Etüdü','Yolu Açılmış','Yolu Açılmamış','Yolu Yok']
  const KONUM_OPTIONS = ['Ana Yola Yakın','Denize Sıfır','Denize Yakın','Havaalanına Yakın','Toplu Ulaşıma Yakın']
  const GENEL_OZELLIKLER_OPTIONS = ['İfrazlı','Parselli','Projeli','Köşe Parsel']
  const MANZARA_ARSA_OPTIONS = ['Şehir','Deniz','Doğa','Boğaz','Göl']

  const allImages = [property.mainImage, ...(property.images || [])].filter(Boolean) as SanityImageSource[];
  const displayDescription = property.description || 'Bu ilan için henüz bir açıklama girilmemiştir.';


  const specs: {label: string; value: string}[] = []
  if (property.listingId) specs.push({label: 'İlan No', value: property.listingId})
  if (property.listingDate) specs.push({label: 'İlan Tarihi', value: formatDateTR(property.listingDate) || '-'})
  
  // Land-specific fields
  if (property.propertyType === 'arsa') {
    // Emlak Tipi for land
    const emlakTipi = property.status === 'satilik' ? 'Satılık Arsa' : 
                     property.status === 'kiralik' ? 'Kiralık Arsa' : 'Arsa'
    specs.push({label: 'Emlak Tipi', value: emlakTipi})
    
    if (property.imarDurumu) specs.push({label: 'İmar Durumu', value: imarDurumuLabel(property.imarDurumu) || '-'})
    if (typeof property.area === 'number') specs.push({label: 'm²', value: `${property.area.toLocaleString('tr-TR')}`})
    if (typeof property.pricePerSquareMeter === 'number') specs.push({label: 'm² Fiyatı', value: `${property.pricePerSquareMeter.toLocaleString('tr-TR')}`})
    if (property.adaNo) specs.push({label: 'Ada No', value: property.adaNo})
    if (property.parselNo) specs.push({label: 'Parsel No', value: property.parselNo})
    if (property.paftaNo) specs.push({label: 'Pafta No', value: property.paftaNo})
    if (property.kaks) specs.push({label: 'Kaks (Emsal)', value: property.kaks})
    if (property.gabari) specs.push({label: 'Gabari', value: property.gabari})
    if (property.krediyeUygunluk) specs.push({label: 'Krediye Uygunluk', value: krediyeUygunlukLabel(property.krediyeUygunluk) || '-'})
    if (property.titleDeedStatus) specs.push({label: 'Tapu Durumu', value: titleDeedLabel(property.titleDeedStatus) || '-'})
    if (property.takas) specs.push({label: 'Takas', value: yesNoLabel(property.takas) || '-'})
  } else {
    // Non-land property fields
    if (typeof property.grossArea === 'number') specs.push({label: 'm² (Brüt)', value: `${property.grossArea.toLocaleString('tr-TR')} m²`})
    if (typeof property.area === 'number') specs.push({label: 'm² (Net)', value: `${property.area.toLocaleString('tr-TR')} m²`})
    if (property.bedrooms) specs.push({label: 'Oda Sayısı', value: property.bedrooms})
    if (typeof property.buildingAge !== 'undefined') specs.push({label: 'Bina Yaşı', value: property.buildingAge || '-'})
    if (property.floor) specs.push({label: 'Bulunduğu Kat', value: property.floor})
    if (typeof property.totalFloors === 'number') specs.push({label: 'Kat Sayısı', value: `${property.totalFloors}`})
    if (property.heatingType) specs.push({label: 'Isıtma', value: heatingLabel(property.heatingType) || '-'})
    if (typeof property.bathrooms === 'number') specs.push({label: 'Banyo Sayısı', value: `${property.bathrooms}`})
    if (property.kitchenType) specs.push({label: 'Mutfak', value: kitchenLabel(property.kitchenType) || '-'})
    if (property.hasBalcony) specs.push({label: 'Balkon', value: hasLabel(property.hasBalcony) || '-'})
    if (property.hasElevator) specs.push({label: 'Asansör', value: hasLabel(property.hasElevator) || '-'})
    if (property.hasParking) specs.push({label: 'Otopark', value: parkingLabel(property.hasParking) || '-'})
    if (property.isFurnished) specs.push({label: 'Eşyalı', value: yesNoLabel(property.isFurnished) || '-'})
    if (property.usageStatus) specs.push({label: 'Kullanım Durumu', value: usageStatusLabel(property.usageStatus) || '-'})
    if (property.isInComplex) specs.push({label: 'Site İçerisinde', value: yesNoLabel(property.isInComplex) || '-'})
    if (property.isInComplex === 'evet' && property.complexName) specs.push({label: 'Site Adı', value: property.complexName})
    if (property.isInComplex === 'evet' && (typeof property.dues === 'number')) specs.push({label: 'Aidat (TL)', value: property.dues.toLocaleString('tr-TR')})
    if (property.status === 'kiralik' && (typeof property.deposit === 'number')) specs.push({label: 'Depozito (TL)', value: property.deposit.toLocaleString('tr-TR')})
    if (property.titleDeedStatus) specs.push({label: 'Tapu Durumu', value: titleDeedLabel(property.titleDeedStatus) || '-'})
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tüm İlanlara Geri Dön
        </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Ana İçerik - Sol Taraf */}
          <div className="xl:col-span-3 space-y-8">
            {/* Galeri */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden">
          <PropertyGallery images={allImages} />
            </div>

            {/* İlan Bilgileri Grid */}
            <div className="grid grid-cols-1 gap-8">
              {/* İlan Açıklaması */}
              <div className="bg-white border border-gray-200 shadow-lg p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">İlan Açıklaması</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{displayDescription}</p>
              </div>

              {/* Özellikler */}
              <div className="bg-white border border-gray-200 shadow-lg p-6">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Teknik Özellikler</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-x-6">
                  {specs.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Özellikler Badges (Kategorili - tüm seçenekler gösterilir, seçilenler mavi) */}
            <details className="bg-white border border-gray-200 shadow-lg group" open>
              <summary className="flex items-center justify-between p-6 cursor-pointer select-none">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Özellikler</h2>
                </div>
                <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="px-6 pb-6">
              {(property.propertyType === 'arsa' ? [
                // Land-specific amenities
                {title: 'Altyapı', options: ALTYAPI_OPTIONS, selected: property.altyapi || []},
                {title: 'Konum', options: KONUM_OPTIONS, selected: property.konum || []},
                {title: 'Genel Özellikler', options: GENEL_OZELLIKLER_OPTIONS, selected: property.genelOzellikler || []},
                {title: 'Manzara', options: MANZARA_ARSA_OPTIONS, selected: property.manzaraArsa || []},
              ].filter(cat => cat.options.length > 0) : [
                // Non-land property amenities
                {title: 'Cephe', options: ORIENTATION_OPTIONS, selected: property.orientation || []},
                {title: 'İç Özellikler', options: INDOOR_FEATURES_OPTIONS, selected: property.indoorFeatures || []},
                {title: 'Dış Özellikler', options: OUTDOOR_FEATURES_OPTIONS, selected: property.outdoorFeatures || []},
                {title: 'Muhit', options: SURROUNDINGS_OPTIONS, selected: property.surroundings || []},
                {title: 'Ulaşım', options: TRANSPORTATION_OPTIONS, selected: property.transportation || []},
                {title: 'Manzara', options: VIEW_OPTIONS, selected: property.view || []},
                {title: 'Konut Tipi', options: RESIDENCE_TYPE_OPTIONS, selected: property.residenceType ? [property.residenceType] : []},
                {title: 'Engelliye ve Yaşlıya Uygun', options: ACCESSIBILITY_OPTIONS, selected: property.accessibility || []},
              ]).map((cat) => (
                <div key={cat.title} className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{cat.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.options.map((opt) => {
                      const isSelected = cat.selected.includes(opt)
                      return (
                        <span
                          key={opt}
                          className={`${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'} px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1.5`}
                        >
                          {isSelected && (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          <span>{opt}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
              </div>
            </details>

            {/* Harita */}
            <div className="bg-white border border-gray-200 shadow-lg overflow-hidden relative z-0">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Konum</h2>
                </div>
          </div>
              <div className="h-96 relative z-0">
            {property.propertyType === 'arsa' && property.polygon && property.polygon.length > 0 ? (
              <PropertyPolygonMapLoader coordinates={property.polygon} />
            ) : 
            property.locationMap ? (
              <MapLoader 
                coordinates={property.locationMap} 
                isApproximate={property.showApproximateLocation === true} 
              />
            ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Bu ilan için harita bilgisi mevcut değil.</p>
                  </div>
            )}
          </div>
        </div>
          </div>

          {/* Sağ Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Fiyat ve Temel Bilgiler */}
              <div className="relative overflow-hidden bg-white border border-gray-200 shadow-lg">
                {/* Status Damgası */}
            {(property.status === 'satildi' || property.status === 'kiralandi') && (
                  <div className="absolute top-6 right-[-60px] rotate-[45deg] w-52 py-2 text-sm font-bold uppercase text-white shadow-lg bg-red-600 text-center z-10">
                    {property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
              </div>
            )}
            
                <div className="p-6">
                  {/* İlan No ve Status */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-900 text-white px-3 py-1 text-xs font-bold">
                      #{property.listingId}
                    </span>
                    <span className={`px-3 py-1 text-xs font-bold text-white ${
                      property.status === 'satilik' ? 'bg-green-600' : 
                      property.status === 'kiralik' ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      {property.status === 'satilik' ? 'SATILIK' : 
                       property.status === 'kiralik' ? 'KİRALIK' : 
                       property.status === 'satildi' ? 'SATILDI' : 'KİRALANDI'}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {property.title}
            </h1>

                  {/* Konum */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">
                      {property.neighborhood}, {property.district} / {property.province}
                    </span>
                  </div>

                  {/* Fiyat */}
            {(property.status === 'satilik' || property.status === 'kiralik') && (
                    <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
                      <p className="text-3xl font-bold text-blue-600 text-center">
                {property.price?.toLocaleString('tr-TR')} ₺
              </p>
                      <p className="text-sm text-blue-600 text-center mt-1">
                        {property.status === 'satilik' ? 'Satış Fiyatı' : 'Aylık Kira'}
                      </p>
                    </div>
                  )}

                  {/* Emlak Tipi */}
                  <div className="text-center mb-6">
                    <span className="bg-gray-100 text-gray-800 px-4 py-2 text-sm font-semibold">
                      {property.status === 'satilik' ? 'SATILIK ' : 
                       property.status === 'kiralik' ? 'KİRALIK ' : ''}
                      {property.propertyType === 'daire' ? 'DAİRE' :
                       property.propertyType === 'villa' ? 'VİLLA' :
                       property.propertyType === 'mustakil' ? 'MÜSTAKİL EV' :
                       property.propertyType === 'isyeri' ? 'İŞYERİ' : 'ARSA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Danışman Bilgileri */}
              {property.agent && (
                <div className="bg-white border border-gray-200 shadow-lg p-6">
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">Danışmanınız</h3>
                  </div>
                  <div className="text-center">
                    {property.agent.image && (
                      <div className="w-20 h-20 mx-auto mb-4 overflow-hidden border-2 border-gray-200">
                        <Image
                          src={urlFor(property.agent.image).width(80).height(80).url()}
                          alt={`${property.agent.name} portre fotoğrafı`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-bold text-gray-900 mb-2">{property.agent.name}</h4>
                    <div className="space-y-2">
                      <a 
                        href={`tel:${property.agent.phone}`}
                        className="block bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        📞 {property.agent.phone}
                      </a>
                      {property.agent.email && (
                        <a 
                          href={`mailto:${property.agent.email}`}
                          className="block bg-gray-600 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                          ✉️ E-posta Gönder
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Sahibindene Git Butonu */}
              {property.sahibindenLink && (
                <div className="bg-white border border-gray-200 shadow-lg p-6">
                  <div className="text-center">
                    <a
                      href={property.sahibindenLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-6 py-3 text-lg font-medium font-semibold text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      style={{ backgroundColor: '#f7ec00' }}
                    >
                      sahibinden.com
                    </a>
                    <p className="mt-2 text-xs text-gray-500">
                      Bu ilanı sahibinden.com&apos;da görüntülemek için tıklayın
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export const revalidate = 10

