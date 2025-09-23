// components/Footer.tsx

import Link from 'next/link'
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white" role="contentinfo">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Şirket Bilgileri */}
            <div>
              <h3 className="text-lg font-bold">Hatice Özen Gayrimenkul</h3>
              <p className="mt-2 text-gray-400">
                Hayallerinizdeki yuvaya kavuşmanız için çalışıyoruz.
              </p>
            </div>
            
            {/* Hızlı Linkler */}
            <div>
            <h3 className="text-lg font-bold">Hızlı Erişim</h3>
            <ul className="mt-2 space-y-1">
              <li><Link href="/" className="text-gray-400 hover:text-white">Ana Sayfa</Link></li>
              <li><Link href="/portfoy" className="text-gray-400 hover:text-white">Portföy</Link></li>
              <li><Link href="/danismanlarimiz" className="text-gray-400 hover:text-white">Ekibimiz</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-white">Hakkımızda</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-white">İletişim</Link></li>
            </ul>
          </div>
  
            {/* İletişim */}
            <div>
              <h3 className="text-lg font-bold">Bize Ulaşın</h3>
              <address className="mt-2 text-gray-400 not-italic">
              Arapsuyu, 660. Sk. No:7 B blok D:2, 07070 Konyaaltı/Antalya<br />
                <a href="tel:+905321202489" className="hover:text-white">0532 120 24 89</a><br />
              </address>
            </div>
          </div>
  
          <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Hatice Özen Gayrimenkul. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer