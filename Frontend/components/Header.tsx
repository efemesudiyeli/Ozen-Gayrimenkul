// components/Header.tsx

import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Özen Gayrimenkul
            </Link>
          </div>

          {/* Navigasyon Menüsü */}
          <nav className="hidden md:flex md:space-x-8">
            <Link
              href="/"
              className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/hakkimizda"
              className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              İletişim
            </Link>
          </nav>

          {/* Mobil Menü Butonu (İleride eklenebilir) */}
          <div className="md:hidden">
            {/* Şimdilik boş, istersen buraya bir mobil menü butonu eklenebilir */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header