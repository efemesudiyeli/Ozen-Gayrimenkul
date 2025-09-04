import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'İletişim | Özen Gayrimenkul',
  description: 'Bizimle iletişime geçin. Adres, telefon ve e-posta bilgilerimiz.',
}

const ContactPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-inter">
            Bize Ulaşın
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-inter">
            Sorularınız, talepleriniz veya randevu için bizimle iletişime geçin.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">

        <div className="mt-12 max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-8">
            {/* Adres */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {/* Ikon yerine SVG veya bir karakter kullanabiliriz */}
                  <span className="text-2xl">📍</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Adres</h3>
                <p className="mt-1 text-gray-600">
                  Güzeloba Mah. Lara Cad. No:123/A, 07230 Muratpaşa/Antalya
                </p>
              </div>
            </div>

            {/* Telefon */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span className="text-2xl">📞</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Telefon</h3>
                <a href="tel:+905555555555" className="mt-1 text-blue-600 hover:text-blue-800">
                  +90 555 555 55 55
                </a>
              </div>
            </div>

            {/* E-posta */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <span className="text-2xl">✉️</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">E-posta</h3>
                <a href="mailto:info@ozengayrimenkul.com" className="mt-1 text-blue-600 hover:text-blue-800">
                  info@ozengayrimenkul.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage