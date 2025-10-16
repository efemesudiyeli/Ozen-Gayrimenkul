import {defineConfig, defineLocale, defineLocaleResourceBundle} from 'sanity'
import {structureTool, StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'
import {trTRLocale} from '@sanity/locale-tr-tr'

export const myStructure = (S: StructureBuilder) =>
  S.list()
    .title('İçerik Yönetimi')
    .items([
      // Sayfa İçerikleri Grubu
      S.listItem()
        .title('Sayfa İçerikleri')
        .child(
          S.list()
            .title('Sayfa İçerikleri')
            .items([
              S.listItem()
                .title('Ana Sayfa')
                .child(S.document().schemaType('hero').documentId('hero')),
              S.listItem()
                .title('Hakkımızda')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('İş Ortaklarımız')
                .child(S.document().schemaType('teamPage').documentId('teamPage')),
              S.listItem()
                .title('İletişim')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem()
                .title('Portföy')
                .child(S.document().schemaType('portfolioPage').documentId('portfolioPage')),
            ]),
        ),

      S.divider(),

      // Emlak İçerikleri Grubu
      S.listItem()
        .title('İlanlar, İş Ortakları')
        .child(
          S.list()
            .title('İlanlar, İş Ortakları')
            .items([
              S.listItem()
                .title('İlanlar')
                .child(
                  S.list()
                    .title('İlanlar')
                    .items([
                      S.listItem()
                        .title('Aktif İlanlar')
                        .child(
                          S.documentList()
                            .title('Aktif İlanlar')
                            .filter('_type == "property" && coalesce(isActive, true) == true')
                            .schemaType('property'),
                        ),
                      S.listItem()
                        .title('Pasif İlanlar')
                        .child(
                          S.documentList()
                            .title('Pasif İlanlar')
                            .filter('_type == "property" && isActive == false')
                            .schemaType('property'),
                        ),
                      S.listItem().title('Tüm İlanlar').child(S.documentTypeList('property')),
                    ]),
                ),
              S.listItem()
                .title('Kıbrıs Projeler')
                .child(
                  S.list()
                    .title('Kıbrıs Projelerindeki İlanlar')
                    .items([
                      S.listItem()
                        .title('Aktif İlanlar')
                        .child(
                          S.documentList()
                            .title('Aktif İlanlar')
                            .filter('_type == "cyprusProperty" && coalesce(isActive, true) == true')
                            .schemaType('cyprusProperty'),
                        ),
                      S.listItem()
                        .title('Pasif İlanlar')
                        .child(
                          S.documentList()
                            .title('Pasif İlanlar')
                            .filter('_type == "cyprusProperty" && isActive == false')
                            .schemaType('cyprusProperty'),
                        ),
                      S.listItem().title('Tüm İlanlar').child(S.documentTypeList('cyprusProperty')),
                    ]),
                ),
              S.listItem().title('İş Ortakları').child(S.documentTypeList('agent')),
            ]),
        ),
    ])

export default defineConfig({
  name: 'default',
  title: 'ozengayrimenkul',
  projectId: 'jy06mayv',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool(),
    colorInput(),
    media(),
    trTRLocale(),
  ],
  i18n: {
    locales: [
      defineLocale({
        id: 'tr-TR',
        title: 'Türkçe',
        weekInfo: {
          firstDay: 1, // Pazartesi
          minimalDays: 1,
          weekend: [6, 7], // Cumartesi ve Pazar
        },
      }),
    ],
    defaultLocale: 'tr-TR',
    bundles: [
      defineLocaleResourceBundle({
        locale: 'tr-TR',
        namespace: 'studio',
        resources: {
          // Genel arayüz metinleri
          'inputs.object.field-group-tabs.all-fields-title': 'Tüm Alanlar',
          'search.filter-all-fields-header': 'Tüm Alanlar',
          'inputs.date.title': 'Tarih Seçin',
          'inputs.date.placeholder': 'Tarih seçin...',
          'inputs.date.invalid': 'Geçersiz tarih',
          'inputs.date.required': 'Tarih gerekli',

          // Publish/Draft durumları
          'pane.document-status-published': 'Yayınlandı',
          'pane.document-status-draft': 'Taslak',
          'pane.document-status-published-draft': 'Yayınlandı (Taslak)',
          'pane.document-status-published-draft-tooltip':
            'Bu belge yayınlandı ancak yayınlanmamış değişiklikler var',
          'pane.document-status-published-tooltip': 'Bu belge yayınlandı',
          'pane.document-status-draft-tooltip': 'Bu belge henüz yayınlanmadı',

          // Eylemler
          'action.publish': 'Yayınla',
          'action.unpublish': 'Yayından Kaldır',
          'action.discard-changes': 'Değişiklikleri İptal Et',
          'action.delete': 'Sil',
          'action.duplicate': 'Kopyala',
          'action.restore': 'Geri Yükle',
          'action.revert': 'Geri Al',
          'action.create': 'Oluştur',
          'action.edit': 'Düzenle',
          'action.save': 'Kaydet',
          'action.cancel': 'İptal',
          'action.close': 'Kapat',
          'action.open': 'Aç',
          'action.upload': 'Yükle',
          'action.download': 'İndir',
          'action.export': 'Dışa Aktar',
          'action.import': 'İçe Aktar',

          // Form metinleri
          'form.required': 'Gerekli',
          'form.optional': 'İsteğe bağlı',
          'form.validation.required': 'Bu alan gerekli',
          'form.validation.min-length': 'En az {minLength} karakter olmalı',
          'form.validation.max-length': 'En fazla {maxLength} karakter olmalı',
          'form.validation.min-value': 'En az {minValue} olmalı',
          'form.validation.max-value': 'En fazla {maxValue} olmalı',
          'form.validation.pattern': 'Geçerli bir format girin',
          'form.validation.email': 'Geçerli bir e-posta adresi girin',
          'form.validation.url': 'Geçerli bir URL girin',

          // Dosya yükleme
          'inputs.files.common.upload': 'Dosya Yükle',
          'inputs.files.common.drag-paste': 'Dosyaları buraya sürükleyin veya yapıştırın',
          'inputs.files.common.invalid-type': 'Geçersiz dosya tipi',
          'inputs.files.common.too-large': 'Dosya çok büyük',
          'inputs.files.common.unknown-error': 'Bilinmeyen hata',

          // Arama
          'search.no-results': 'Sonuç bulunamadı',
          'search.placeholder': 'Ara...',
          'search.clear': 'Temizle',

          // Hata mesajları
          'error.document-not-found': 'Belge bulunamadı',
          'error.unauthorized': 'Bu işlem için yetkiniz yok',
          'error.network': 'Ağ hatası',
          'error.unknown': 'Bilinmeyen hata oluştu',

          // Başarı mesajları
          'success.published': 'Başarıyla yayınlandı',
          'success.unpublished': 'Başarıyla yayından kaldırıldı',
          'success.saved': 'Başarıyla kaydedildi',
          'success.deleted': 'Başarıyla silindi',
          'success.duplicated': 'Başarıyla kopyalandı',
          'success.restored': 'Başarıyla geri yüklendi',

          // Uyarı mesajları
          'warning.unsaved-changes': 'Kaydedilmemiş değişiklikler var',
          'warning.delete-document': 'Bu belgeyi silmek istediğinizden emin misiniz?',
          'warning.unpublish-document':
            'Bu belgeyi yayından kaldırmak istediğinizden emin misiniz?',

          // Onay metinleri
          'confirm.delete': 'Sil',
          'confirm.cancel': 'İptal',
          'confirm.yes': 'Evet',
          'confirm.no': 'Hayır',
          'confirm.ok': 'Tamam',

          // Zaman damgaları
          'time.ago': '{time} önce',
          'time.just-now': 'Az önce',
          'time.minutes-ago': '{count} dakika önce',
          'time.hours-ago': '{count} saat önce',
          'time.days-ago': '{count} gün önce',
          'time.weeks-ago': '{count} hafta önce',
          'time.months-ago': '{count} ay önce',
          'time.years-ago': '{count} yıl önce',

          // Zaman formatları
          'time.published': 'Yayınlandı',
          'time.created': 'Oluşturuldu',
          'time.updated': 'Güncellendi',
          'time.last-modified': 'Son değişiklik',
          'time.published-ago': '{time} önce yayınlandı',
          'time.created-ago': '{time} önce oluşturuldu',
          'time.updated-ago': '{time} önce güncellendi',

          // Tarih formatları
          'date.format.short': 'DD/MM/YYYY',
          'date.format.long': 'DD MMMM YYYY',
          'date.format.time': 'HH:mm',
          'date.format.datetime': 'DD/MM/YYYY HH:mm',

          // Hafta günleri
          'date.weekday.monday': 'Pazartesi',
          'date.weekday.tuesday': 'Salı',
          'date.weekday.wednesday': 'Çarşamba',
          'date.weekday.thursday': 'Perşembe',
          'date.weekday.friday': 'Cuma',
          'date.weekday.saturday': 'Cumartesi',
          'date.weekday.sunday': 'Pazar',

          // Aylar
          'date.month.january': 'Ocak',
          'date.month.february': 'Şubat',
          'date.month.march': 'Mart',
          'date.month.april': 'Nisan',
          'date.month.may': 'Mayıs',
          'date.month.june': 'Haziran',
          'date.month.july': 'Temmuz',
          'date.month.august': 'Ağustos',
          'date.month.september': 'Eylül',
          'date.month.october': 'Ekim',
          'date.month.november': 'Kasım',
          'date.month.december': 'Aralık',
        },
      }),
    ],
  },
  schema: {
    types: schemaTypes,
  },
})
