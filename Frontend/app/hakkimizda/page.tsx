import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımızda | Özen Gayrimenkul',
  description: 'Özen Gayrimenkul olarak vizyonumuz, misyonumuz ve hedeflerimiz hakkında daha fazla bilgi edinin.',
}

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Hakkımızda
          </h1>
          <p className="mt-4 text-center text-lg text-gray-600">
            Hayallerinizdeki yuvaya giden yolda güvenilir ortağınız.
          </p>

          <div className="mt-12 text-gray-700 space-y-6 leading-relaxed">
            <p>
              Özen Gayrimenkul, 2025 yılında Antalya'nın dinamik emlak piyasasında fark yaratmak amacıyla kurulmuştur. Kurulduğumuz günden bu yana, müşteri memnuniyetini en üst düzeyde tutarak, şeffaf, dürüst ve profesyonel hizmet anlayışıyla hareket etmekteyiz. Amacımız, sadece bir mülk satmak veya kiralamak değil, aynı zamanda müşterilerimizin hayallerini süsleyen yaşam alanlarına kavuşmalarını sağlamaktır.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t">
              Vizyonumuz
            </h2>
            <p>
              Sektördeki yenilikleri takip ederek ve teknolojiyi etkin bir şekilde kullanarak, Antalya ve çevresinde gayrimenkul danışmanlığı denildiğinde akla gelen ilk ve en güvenilir marka olmak.
            </p>
            <h2 className="text-2xl font-semibold text-gray-800 pt-4 border-t">
              Misyonumuz
            </h2>
            <p>
              Müşterilerimize, ihtiyaçlarına en uygun gayrimenkul seçeneklerini, doğru fiyat ve profesyonel bir süreç yönetimi ile sunmak. Bu süreçte, yatırımcılar için kârlı, ev arayanlar için ise huzurlu ve mutlu sonuçlar yaratmaktır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage